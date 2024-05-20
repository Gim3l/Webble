import { setup, assign, raise } from "xstate";
import { ElementNode } from "~/components/collect/elements/config";
import { Edge, getOutgoers, Node } from "@xyflow/react";
import {
  ChoiceInputElementData,
  elementsConfig,
  ElementTypes,
} from "@webble/elements";

type EdgeData = {
  conditions: { variable: string; cond: "="; value: string }[];
};
type Element = Pick<ElementNode | Node<{}, "message">, "type" | "id" | "data">;

type MachineContext = {
  elements: Element[];
  edges: Edge<EdgeData>[];
  nextElementId: null | string;
  message?: string;
  input?: Pick<Node, "type" | "data">;
  messages?: Pick<Node, "id" | "type" | "data">[];
  // values collected
  values: Record<
    string,
    { value: number | string; type: "variable" | "input" }
  >;
};

type MachineInput = Pick<
  MachineContext,
  "edges" | "elements" | "message" | "values"
>;

export const initialState: MachineInput = {
  start: "node-1",
  elements: [
    {
      id: "node-1",
      type: "text_input",
      data: { buttonLabel: "", placeholder: "" },
    },
    {
      id: "node-2",
      type: "number_input",
      data: { buttonLabel: "", placeholder: "" },
    },
    {
      id: "node-3",
      type: "message",
      data: { buttonLabel: "", placeholder: "" },
    },
    {
      id: "node-4",
      type: "message",
      data: { buttonLabel: "", placeholder: "" },
    },
  ],
  edges: [
    { id: "edge-1", source: "node-1", target: "node-2", data: {} },
    {
      id: "edge-2",
      source: "node-2",
      target: "node-3",
      data: {
        conditions: [{ variable: "animal", cond: "=", value: "Cat" }],
      },
    },
    { id: "edge-3", source: "node-3", target: "node-4", data: {} },
  ],
  values: {},
};

export const chatMachine = setup({
  types: {
    context: {} as MachineContext,
    events: {} as
      | { type: "continueChat"; message: string }
      | { type: "resetMessages" }
      | { type: "collectMessage"; node: Element }
      | {
          type: "checkEdge";
          edge: Edge<EdgeData>;
        }
      | { type: "final"; edge: Edge },
    input: {} as MachineInput,
  },
  actions: {
    goToNextElement: ({ context, self, event }) => {
      // use last message as starting point if we can
      const lastMessageId = context.messages?.length
        ? context.messages[context.messages.length - 1].id
        : null;

      const startElId = lastMessageId || context.nextElementId || "start";

      const currentElement = context.elements.find(
        (el) => el.id === context.nextElementId,
      ) as ElementNode;

      console.log({ lastMessageId, startElId });

      // edges where start element is a source
      const currentElementSourceEdges = context.edges.filter(
        (edge) => edge.source === startElId,
      );

      // handle branch nodes, we want to selectively retrieve the next node
      if (
        !!currentElement &&
        currentElement.type === "choice_input" &&
        event.type === "continueChat"
      ) {
        console.log("FINDING THE RIGHT OPTION ");
        const selectedOption = currentElement.data.options.find(
          (i) => i.label === event.message,
        );

        console.log({ message: event.message, selectedOption });

        if (!selectedOption || !context.message) {
          // go to choice fallback branch

          const fallbackEdge = currentElementSourceEdges.find(
            (edge) =>
              !(currentElement.data as ChoiceInputElementData).options
                .map((option) => option.id)
                .includes(edge.sourceHandle || edge.source),
          );

          console.log({
            fallbackEdge,
            currentElementSourceEdges,
            options: currentElement.data.options,
          });

          if (fallbackEdge) {
            self.send({
              type: "checkEdge",
              edge: fallbackEdge,
            });
          }
        }

        const nextEdges = currentElementSourceEdges.filter(
          (el) => el.sourceHandle === selectedOption?.id,
        );

        console.log({ nextEdges });

        for (const edge of nextEdges) {
          self.send({
            type: "checkEdge",
            edge,
          });
        }
      } else {
        // will transition to node connected to the first passing edge
        for (const edge of currentElementSourceEdges) {
          self.send({
            type: "checkEdge",
            edge,
          });
        }
      }
    },
    checkEdge: ({ self, event, context }) => {
      if (event.type !== "checkEdge") return;

      const conditions = event.edge?.data?.conditions || [];
      const passes = [];

      for (const condition of conditions) {
        console.log("CHECKING COND", condition, context.values);

        if (!context.values[condition.variable]) {
          passes.push(false);
          continue;
        }

        switch (condition.cond) {
          case "=": {
            console.log(
              "NOT EQ??",
              context.values[condition.variable].value,
              condition.value,
            );
            passes.push(
              context.values[condition.variable].value == condition.value,
            );

            break;
          }
        }
      }

      console.log({ passes });
      if (!passes.includes(false)) {
        self.send({ type: "final", edge: event.edge });
      }
    },
    finalize: assign({
      nextElementId: ({ event, context, self }) => {
        if (event.type !== "final") return null;

        const node = context.elements.find(
          (node) => node.id === event.edge.target,
        );

        // check if current node is message node, if so,
        // check if current node has outgoers
        // run, goToNextElement to resolve next input node,
        // if there is no input node left i.e no outgoers, then we finalize
        if (
          node &&
          elementsConfig[node.type as ElementTypes].group === "Bubbles"
        ) {
          const outgoers = getOutgoers(
            node,
            context.elements as Node[],
            context.edges,
          );

          console.log({ currentMessages: context.messages, outgoers });

          self.send({ type: "collectMessage", node });
        }

        return event.edge.target;
      },
      input: ({ event, context }) => {
        if (event.type !== "final") return;

        const inputEl = context.elements
          .filter(
            (el) =>
              el.type &&
              elementsConfig[el.type as ElementTypes]?.group === "Inputs",
          )
          .find((el) => el.id === event.edge.target);
        if (!inputEl) return;

        return { id: inputEl.id, type: inputEl.type, data: inputEl.data };
      },
    }),
    collectMessage: assign({
      messages: ({ event, context }) => {
        if (event.type !== "collectMessage") return;
        console.log("COLLECTING MESSAGE");

        return [
          ...(context.messages || []),
          { id: event.node.id, type: event.node.type, data: event.node.data },
        ];
      },
      nextElementId: ({ event, context }) => {
        if (event.type !== "collectMessage") return null;

        // if we are at a leaf bubble/message node then we finalize by setting the nextElementId
        const outgoers = getOutgoers(
          event.node,
          context.elements as Node[],
          context.edges,
        );

        if (outgoers.length) return null;

        return event.node.id;
      },
    }),
    resetMessages: assign(() => ({ messages: [] })),
  },
}).createMachine({
  context: ({ input }) => ({
    elements: input.elements,
    edges: input.edges,
    nextElementId: null,
    message: input.message,
    values: { a: { type: "variable", value: "b" } },
    messages: [],
  }),

  on: {
    collectMessage: {
      actions: ["collectMessage", "goToNextElement"],
    },
    continueChat: {
      actions: ["goToNextElement"],
    },
    checkEdge: {
      actions: ["checkEdge"],
    },
    resetMessages: {
      actions: ["resetMessages"],
    },
    final: {
      // reenter: true,
      actions: ["finalize"],
    },
  },
});
