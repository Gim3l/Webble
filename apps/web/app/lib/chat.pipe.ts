import { Effect, pipe } from "effect";
import { Edge, Node } from "@xyflow/react";
import {
  EdgeData,
  GroupElement,
  GroupNodeData,
  isFromInputsGroup,
} from "@webble/elements";

type ChatState = {
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

function startup(state: ChatState): Effect.Effect<ChatState, Error> {
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

function saveInput(state: ChatState): Effect.Effect<ChatState, Error> {
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
function jumpIfNecessary(state: ChatState): Effect.Effect<ChatState, Error> {
  if (state.lastCapturedEl) {
    // const startingElementIndex = state.group?.data.elements.find(
    //     (element) => element.id === state.startingElementId,
    // );

    const linkedEdges = state.edges.filter(
      (edge) => edge.sourceHandle === state.lastCapturedEl?.id,
    );

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
          state.group.data.elements[elementIndex - 1] || null;
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
        (group) => linkedEdges?.[0].target === group.id,
      );

      if (newGroup) {
        console.log("switching to new group....");
        state.group = newGroup;
        state.initialLastCapturedEl = null;
        state.lastCapturedEl = state.group.data.elements[0];
      } else {
        return Effect.fail(new Error("Session ended"));
      }
    }
  }

  return Effect.succeed(state);
}

function captureNextGroupElements(
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

    if (
      isFromInputsGroup(element) ||
      nextGroupElements.indexOf(element) === nextGroupElements.length - 1
    ) {
      return Effect.succeed(state);
    }
  }

  return Effect.succeed(state);
}

// export const program = Effect.gen(function* () {
//   const a = yield* startup;
// });
//
// class MyService {
//   readonly local = 1;
//
//   compute = Effect.gen(this, function* () {
//     return yield* Effect.succeed(this.local + 1);
//   });
// }

export const runChatPipeline = (state: ChatState) =>
  pipe(
    Effect.succeed(state),
    Effect.flatMap((state) => startup(state)),
    Effect.flatMap((state) => saveInput(state)),
    Effect.flatMap((state) => jumpIfNecessary(state)),
    Effect.flatMap((state) => captureNextGroupElements(state)),
  );
