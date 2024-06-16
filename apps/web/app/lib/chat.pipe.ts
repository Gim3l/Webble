import { Effect, pipe, Logger, LogLevel } from "effect";
import { Edge, Node } from "@xyflow/react";
import {
  EdgeData,
  elementHasOptions,
  GroupElement,
  GroupNodeData,
  isFromInputsGroup,
  isGroupElementType,
  isTerminalGroupElement,
  TYPE_IMAGE_BUBBLE_ELEMENT,
  TYPE_REQUEST_LOGIC_ELEMENT,
  TYPE_SCRIPT_LOGIC_ELEMENT,
  TYPE_TEXT_BUBBLE_ELEMENT,
  variableRegex,
  isGroupElementTypes,
  TYPE_INPUT_ELEMENT,
  TYPE_NUMBER_INPUT_ELEMENT,
  TYPE_EMAIL_INPUT_ELEMENT,
} from "@webble/elements";
import { RequestError } from "~/lib/errors";

export type ChatState = {
  lastMessage?: string;
  lastCapturedEl: GroupElement | null;
  initialLastCapturedEl: GroupElement | null;
  group: Node<GroupNodeData> | null;
  captures: GroupElement[];
  groups: Node<GroupNodeData>[];
  edges: Edge<EdgeData>[];
  // values collected
  values: Record<
    string,
    { value: number | string; type: "variable" | "input" }
  >;
};

function withVariables(
  groupElement: GroupElement,
  state: ChatState,
): GroupElement {
  const variables = state.values;

  if (isGroupElementType(groupElement, TYPE_IMAGE_BUBBLE_ELEMENT)) {
    const url = groupElement.data.url;
    const variableMatches = url.match(variableRegex);
    variableMatches?.forEach((match) => {
      const variableName = match.replace(/[{}]/g, "");

      if (variables[variableName]) {
        const variableValue = variables[variableName].value;
        groupElement.data.url = groupElement.data.url.replace(
          match,
          variableValue.toString(),
        );
      }
    });
  }

  if (isGroupElementType(groupElement, TYPE_SCRIPT_LOGIC_ELEMENT)) {
    const code = groupElement.data.code;
    const variableMatches = code.match(variableRegex);
    variableMatches?.forEach((match) => {
      const variableName = match.replace(/[{}]/g, "");

      if (variables[variableName]) {
        const variableValue = variables[variableName].value;
        groupElement.data.code = groupElement.data.code.replace(
          match,
          variableValue.toString(),
        );
      }
    });
  }

  if (isGroupElementType(groupElement, TYPE_TEXT_BUBBLE_ELEMENT)) {
    const text = groupElement.data.text;
    const variableMatches = text.match(variableRegex);
    variableMatches?.forEach((match) => {
      const variableName = match.replace(/[{}]/g, "");

      if (variables[variableName]) {
        const variableValue = variables[variableName].value;
        groupElement.data.text = groupElement.data.text.replace(
          match,
          variableValue.toString(),
        );
      }
    });
  }

  if (
    isGroupElementTypes(groupElement, [
      TYPE_INPUT_ELEMENT,
      TYPE_NUMBER_INPUT_ELEMENT,
      TYPE_EMAIL_INPUT_ELEMENT,
    ])
  ) {
    const placeholderMatches =
      groupElement.data.placeholder.match(variableRegex);
    const buttonLabelMatches =
      groupElement.data.buttonLabel.match(variableRegex);

    placeholderMatches?.forEach((match) => {
      const variableName = match.replace(/[{}]/g, "");

      if (variables[variableName]) {
        const variableValue = variables[variableName].value;
        groupElement.data.placeholder = groupElement.data.placeholder.replace(
          match,
          variableValue.toString(),
        );
      }
    });

    buttonLabelMatches?.forEach((match) => {
      const variableName = match.replace(/[{}]/g, "");

      if (variables[variableName]) {
        const variableValue = variables[variableName].value;
        groupElement.data.buttonLabel = groupElement.data.placeholder.replace(
          match,
          variableValue.toString(),
        );
      }
    });
  }

  return groupElement;
}

/**
 * Sets the initial last captured element and starting group
 * @param state
 */
export function startup(state: ChatState): Effect.Effect<ChatState, Error> {
  state.initialLastCapturedEl = state.lastCapturedEl;

  if (!state.lastCapturedEl) {
    const startEdge = state.edges.find((edge) => edge.source === "start");
    const startGroup = state.groups.find(
      (group) => group.id === startEdge?.target,
    );
    if (!startGroup) return Effect.fail(new Error("Starting group not found"));

    state.lastCapturedEl = startGroup.data.elements[0];
  }

  const group = state.groups.find(
    (group) => group.id === state.lastCapturedEl?.groupId,
  );
  if (!group) return Effect.fail(new Error("Starting group not found"));
  state.group = group;

  return Effect.succeed(state);
}

/**
 * Saves the input from the message as a variable if a message is provided
 * @param state
 */
export function saveInput(state: ChatState): Effect.Effect<ChatState, Error> {
  if (isFromInputsGroup(state.lastCapturedEl) && state.lastMessage) {
    if (state.lastCapturedEl.data?.variable) {
      state.values[state.lastCapturedEl.data?.variable] = {
        type: "variable",
        value: state.lastMessage,
      };
    }
  }

  if (isGroupElementType(state.lastCapturedEl, TYPE_REQUEST_LOGIC_ELEMENT) && state.lastMessage) {
    // if last captured element was a request logic element, then we need to parse the response as JSON
    // and set all variables from the response as values
  }

  return Effect.succeed(state);
}
// if the starting node has an edge to another group, jump to that group
export function jumpIfNecessary(
  state: ChatState,
): Effect.Effect<ChatState, Error> {
  if (state.initialLastCapturedEl) {
    // const startingElementIndex = state.group?.data.elements.find(
    //     (element) => element.id === state.startingElementId,
    // );

    const linkedEdges = state.edges.filter(
      (edge) => edge.sourceHandle === state.lastCapturedEl?.id,
    );

    // handle elements with multiple handles/edges
    if (elementHasOptions(state.lastCapturedEl)) {
      for (const option of state.lastCapturedEl.data.options) {
        const optionEdges = state.edges.filter(
          (edge) => edge.sourceHandle === option.id,
        );

        if (option.label === state.lastMessage && optionEdges.length === 1) {
          const resolvedEdge = optionEdges[0];

          const newGroup = state.groups.find(
            (group) => group.id === resolvedEdge.target,
          );
          if (newGroup) state.lastCapturedEl = null;
          state.group = newGroup || state.group;

          // point to new element within the next group
          if (
            state.group &&
            resolvedEdge.targetHandle &&
            resolvedEdge.targetHandle !== resolvedEdge.target
          ) {
            const elementIndex = state.group.data.elements.findIndex(
              (element) => element.id === resolvedEdge.targetHandle,
            );
            state.lastCapturedEl =
              state.group.data.elements[(elementIndex || 1) - 1] || null;

            // always set initial lastCapturedEl to null when switching to fist element of a group
            // so the element is returned
            if (elementIndex === 0) state.initialLastCapturedEl = null;

            return Effect.succeed(state);
          }
        }
      }
    }

    if (linkedEdges?.length === 1) {
      const newGroup = state.groups.find(
        (group) => group.id === linkedEdges[0].target,
      );
      if (newGroup) state.lastCapturedEl = null;
      state.group = newGroup || state.group;

      // point to new element within the next group
      if (
        state.group &&
        linkedEdges[0].targetHandle &&
        linkedEdges[0].targetHandle !== linkedEdges[0].target
      ) {
        const elementIndex = state.group.data.elements.findIndex(
          (element) => element.id === linkedEdges[0].targetHandle,
        );
        state.lastCapturedEl =
          state.group.data.elements[(elementIndex || 1) - 1] || null;
        if (elementIndex === 0) state.initialLastCapturedEl = null;

        return Effect.succeed(state);
      }
    }

    // jump to next group after last element of current group
    if (
      state.group &&
      state.lastCapturedEl?.id ===
        state?.group.data?.elements[state?.group.data.elements.length - 1]?.id
    ) {
      const linkedEdges = state.edges.filter(
        (edge) => edge.source === state.group?.id,
      );
      const newGroup = state.groups.find(
        (group) => linkedEdges?.[0]?.target === group.id,
      );

      if (newGroup) {
        state.group = newGroup;
        state.initialLastCapturedEl = null;
        state.lastCapturedEl = state.group.data.elements[0];
      } else {
        // handle end of chat
        return Effect.succeed(state);
      }
    }
  }

  return Effect.succeed(state);
}

const httpRequest = (url: string) =>
  Effect.tryPromise({
    try: () => fetch(url),
    catch: () => new RequestError(),
  });

export function captureNextGroupElements(state: ChatState) {
  return Effect.gen(function* (_) {
    let startingIndex = 0;

    if (state.lastCapturedEl) {
      const startingElementIndex = state.group?.data.elements.findIndex(
        (element) => element.id === state.lastCapturedEl?.id,
      );
      if (startingElementIndex !== -1 && startingElementIndex !== undefined) {
        startingIndex = startingElementIndex;
      }
    }

    const nextGroupElements = state.group?.data.elements.slice(startingIndex);
    if (!nextGroupElements?.length) {
      return yield* Effect.succeed(state);
    }

    for (const element of nextGroupElements) {
      if (
        element.id === state.lastCapturedEl?.id &&
        state.initialLastCapturedEl !== null
      )
        continue;

      // handle request logic
      if (
        isGroupElementType(element, TYPE_REQUEST_LOGIC_ELEMENT) &&
        !element.data.runOnClient
      ) {
        const response = yield* httpRequest(element.data.request.url);
        const data = yield* Effect.tryPromise(() => response.json());
        console.log({ data });
        continue;
      }

      yield* Effect.log(`Capturing ${element.type} `);
      state.captures.push(element);

      if (isTerminalGroupElement(element)) {
        return yield* Effect.succeed(state);
      }

      // POST JUMP
      // jump to new group if last element from current group is not a terminal element,
      // e.g a text bubble is the last element
      if (
        element.id === nextGroupElements[nextGroupElements.length - 1]?.id &&
        !isTerminalGroupElement(element)
      ) {
        yield* Effect.log("Jumping to next group");

        const linkedEdges = state.edges
          .filter((edge) => edge.source === state.group?.id)
          .filter((edge) =>
            state.groups.map((group) => group.id).includes(edge.target),
          );

        console.log({ linkedEdges });

        if (linkedEdges.length === 0) return yield* Effect.succeed(state);
        const newGroup = state.groups.find(
          (group) => group.id === linkedEdges?.[0].target,
        );

        console.log("Linked edges" + linkedEdges.length);

        if (newGroup && linkedEdges.length === 1) {
          state.group = newGroup;
          newGroup.data.elements.forEach((el) => {
            nextGroupElements.push(el);
          });
        }
      }
    }

    return yield* Effect.succeed(state);
  }).pipe(
    Effect.annotateLogs({
      groupId: state.group?.id,
      totalCaptures: state.captures.length,
    }),
  );
}

export function applyVariables(
  state: ChatState,
): Effect.Effect<ChatState, Error> {
  state.captures = state.captures.map((element) =>
    withVariables(element, state),
  );
  return Effect.succeed(state);
}

function logState(state: ChatState, message: string) {
  return Effect.gen(function* () {
    yield* Effect.succeed(state);
    return yield* Effect.log(message);
  }).pipe(
    Effect.annotateLogs({
      captures: state.captures.length,
      groupId: state.group?.id,
    }),
  );
}

export const runChatPipeline = (state: ChatState) =>
  pipe(
    Effect.succeed(state),
    Effect.tap((state) => logState(state, "Starting chat pipeline")),
    Effect.flatMap((state) => startup(state)),
    Effect.tap((state) => logState(state, "Saving input from message")),
    Effect.flatMap((state) => saveInput(state)),
    Effect.tap((state) =>
      logState(state, "Jumping to next group if necessary"),
    ),
    // PRE-JUMP
    Effect.flatMap((state) => jumpIfNecessary(state)),
    Effect.tap((state) =>
      logState(state, "Starting capture of next group elements"),
    ),
    Effect.flatMap((state) => captureNextGroupElements(state)),
    Effect.tap(() =>
      logState(state, "Applying variables to captured elements"),
    ),
    Effect.flatMap((state) => applyVariables(state)),
    Effect.tap((state) => logState(state, "Finished chat pipeline")),
    Effect.withLogSpan("program"),
  );
