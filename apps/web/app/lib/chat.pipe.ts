import { Effect, pipe } from "effect";
import { Edge, Node } from "@xyflow/react";
import {
  EdgeData,
  elementHasOptions,
  GroupElement,
  GroupNodeData,
  isFromInputsGroup,
} from "@webble/elements";

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

  // if (state.startingElementId) {
  //   const element = group.data.elements.find(
  //     (element) => element.id === state.startingElementId,
  //   );
  //   if (!element) return Effect.fail(new Error("Starting element not found"));
  //   state.captures = [element];
  // }
  return Effect.succeed(state);
}

export function saveInput(state: ChatState): Effect.Effect<ChatState, Error> {
  if (isFromInputsGroup(state.lastCapturedEl) && state.lastMessage) {
    if (state.lastCapturedEl.data?.variable) {
      state.values[state.lastCapturedEl.data?.variable] = {
        type: "variable",
        value: state.lastMessage,
      };
    }
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
      console.log("LINKED EDGES FOR ELEMENT", linkedEdges);
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
        console.log("switching to new group....");
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

export function captureNextGroupElements(
  state: ChatState,
): Effect.Effect<ChatState, Error> {
  let startingIndex = 0;

  if (state.lastCapturedEl) {
    console.log({ startingElementId: state.lastCapturedEl.id });
    const startingElementIndex = state.group?.data.elements.findIndex(
      (element) => element.id === state.lastCapturedEl?.id,
    );
    if (startingElementIndex !== -1 && startingElementIndex !== undefined) {
      startingIndex = startingElementIndex;
    }
  }

  const nextGroupElements = state.group?.data.elements.slice(startingIndex);
  if (!nextGroupElements?.length) return Effect.succeed(state);

  for (const element of nextGroupElements) {
    if (
      element.id === state.lastCapturedEl?.id &&
      state.initialLastCapturedEl !== null
    )
      continue;
    state.captures.push(element);

    if (isFromInputsGroup(element)) {
      return Effect.succeed(state);
    }

    // POST JUMP
    // jump to new group if last element from current group is not from inputs group,
    // e.g a text bubble is the last element
    if (
      element.id === nextGroupElements[nextGroupElements.length - 1]?.id &&
      !isFromInputsGroup(element)
    ) {
      const linkedEdges = state.edges.filter(
        (edge) => edge.source === state.group?.id,
      );
      const newGroup = state.groups.find(
        (group) => group.id === linkedEdges?.[0].target,
      );

      if (newGroup && linkedEdges.length === 1) {
        state.group = newGroup;
        newGroup.data.elements.forEach((el) => {
          nextGroupElements.push(el);
        });
      }
    }
  }

  return Effect.succeed(state);
}

export const runChatPipeline = (state: ChatState) =>
  pipe(
    Effect.succeed(state),
    Effect.flatMap((state) => startup(state)),
    Effect.flatMap((state) => saveInput(state)),
    // PRE-JUMP
    Effect.flatMap((state) => jumpIfNecessary(state)),
    Effect.flatMap((state) => captureNextGroupElements(state)),
  );
