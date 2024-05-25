import { assign, setup } from "xstate";
import { Edge, Node } from "@xyflow/react";
import {
  EdgeData,
  elementsConfig,
  GroupElement,
  GroupNodeData,
} from "@webble/elements";

type MachineContext = {
  // elements collected
  group: Node<GroupNodeData> | null;
  captures: GroupElement[];
  groups: Node<GroupNodeData>[];
  edges: Edge<EdgeData>[];
  lastMessage?: string;

  input?: Pick<Node, "type" | "data">;
  // values collected
  values: Record<
    string,
    { value: number | string; type: "variable" | "input" }
  >;
};
type MachineInput = {
  groups: Node<GroupNodeData>[];
  edges: Edge<EdgeData>[];
};

export const formMachine = setup({
  types: {
    context: {} as MachineContext,
    events: {} as
      | { type: "start" }
      | { type: "set.lastMessage"; message: string },
    input: {} as MachineInput,
  },
  actions: {
    getStartGroup: assign({
      group: ({ context }) => {
        const startEdge = context.edges.find(
          (edge) => edge.source === "start" || edge.sourceHandle === "start",
        );
        if (!startEdge) return context.group;
        return (
          context.groups.find((group) => group.id === startEdge.target) ||
          context.group
        );
      },
    }),
    setLastMessage: assign({
      captures: () => [],
      lastMessage: ({ event }) => {
        console.log("SETTING");
        if (event.type === "set.lastMessage") {
          return event.message;
        }
      },
    }),
    getNextGroupElement: assign({
      captures: ({ context }) => {
        // get index of last capture
        let nextCapture = context.group?.data.elements[0];
        if (context.captures.length) {
          const lastCapture = context.captures[context.captures.length - 1];
          const lastCaptureGroupIndex = context.group?.data.elements.findIndex(
            (element) => element.id === lastCapture.id,
          );
          // if no index, return first group element
          if (lastCaptureGroupIndex === -1 || !lastCaptureGroupIndex) {
            return nextCapture
              ? [...context.captures, nextCapture]
              : [...context.captures];
          }

          // get next element after the last captured element's index
          nextCapture = context.group?.data.elements[lastCaptureGroupIndex + 1];

          return nextCapture
            ? [...context.captures, nextCapture]
            : [...context.captures];
        }

        return nextCapture
          ? [...context.captures, nextCapture]
          : [...context.captures];
      },
    }),

    finalize() {
      console.log("EXITING!!!!");
    },
  },
}).createMachine({
  initial: "start",
  context: ({ input }) => ({
    group: null,
    groups: input.groups,
    edges: input.edges,
    values: {},
    captures: [],
    lastMessage: "",
  }),

  states: {
    start: {
      entry: ["getStartGroup"],
      on: {
        "set.lastMessage": {
          actions: ["setLastMessage"],
          target: "captureNextGroupElement",
        },
      },
    },
    captureNextGroupElement: {
      always: {
        // check if we reached end of group
        // or the last element is an input element
        guard: ({ context }) => {
          console.log({ captures: context.captures });
          const lastCapturedElement =
            context.captures[context.captures.length - 1];

          const lastCapturedElementGroup =
            elementsConfig?.[lastCapturedElement?.type]?.group;

          const lastGroupElementCaptured =
            lastCapturedElement?.id ===
            context.group?.data.elements[
              context.group?.data.elements.length - 1
            ]?.id;

          console.log(
            "GUARD>",
            !lastGroupElementCaptured && lastCapturedElementGroup !== "Inputs",
          );

          return context.captures.length < 2;
        },
        // cycle through each element
        // if the element has an edge, jump by traveling along the edge
        // traveling entails, setting a new target group and rerunning captureNextGroupElement
        actions: ["getNextGroupElement"],
        target: "captureNextGroupElement",
      },
      reenter: true,
      target: "exit",
    },
    exit: {},
  },
});
