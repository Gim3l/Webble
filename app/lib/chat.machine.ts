import { setup, assign, raise } from "xstate";
import { ElementNode } from "~/components/collect/elements/config";
import { Edge, Node } from "@xyflow/react";

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
  messages?: Pick<Node, "type" | "data">[];
  // values collected
  values: Record<
    string,
    { value: number | string; type: "variable" | "input" }
  >;
};

type MachineInput = Pick<
  MachineContext,
  "start" | "edges" | "elements" | "message" | "values"
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
      | {
          type: "checkEdge";
          edge: Edge<EdgeData>;
        }
      | { type: "final"; edge: Edge },
    input: {} as MachineInput,
  },
  actions: {
    goToNextElement: ({ context, self, event }) => {
      const startElId = context.nextElementId || "start";

      const currentElement = context.elements.find(
        (el) => el.id === context.nextElementId
      ) as ElementNode;

      // edges where start element is a source
      const currentElementSourceEdges = context.edges.filter(
        (edge) => edge.source === startElId
      );

      // will transition to node connected to the first passing edge
      for (const edge of currentElementSourceEdges) {
        self.send({
          type: "checkEdge",
          edge,
        });
      }

      // handle branch nodes
      if (
        !!currentElement &&
        currentElement.type === "choice_input" &&
        event.type === "continueChat"
      ) {
        console.log("FINDING THE RIGHT OPTION ");
        const selectedOption = currentElement.data.options.find(
          (i) => i.label === event.message
        );

        console.log({ message: event.message, selectedOption });

        if (!selectedOption || !context.message) {
          // go to choice fallback branch

          const fallbackEdge = currentElementSourceEdges.find(
            (edge) =>
              !currentElement.data.options
                .map((option) => option.id)
                .includes(edge.sourceHandle || edge.source)
          );

          console.log({
            fallbackEdge,
            currentElementSourceEdges,
            options: currentElement.data.options,
          });

          self.send({
            type: "checkEdge",
            edge: fallbackEdge,
          });
        }

        const nextEdges = currentElementSourceEdges.filter(
          (el) => el.sourceHandle === selectedOption?.id
        );

        for (const edge of nextEdges) {
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
              condition.value
            );
            passes.push(
              context.values[condition.variable].value == condition.value
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
      nextElementId: ({ event }) => {
        if (event.type === "final") {
          return event.edge.target;
        }

        return null;
      },
      input: ({ event, context }) => {
        if (event.type !== "final") return;

        const inputEl = context.elements.find(
          (el) => el.id === event.edge.target
        );
        if (!inputEl) return;

        return { id: inputEl.id, type: inputEl.type, data: inputEl.data };
      },
    }),
  },
}).createMachine({
  context: ({ input }) => ({
    elements: input.elements,
    edges: input.edges,
    nextElementId: null,
    message: input.message,
    values: { a: { type: "variable", value: "b" } },
    input: {},
  }),
  on: {
    continueChat: {
      actions: ["goToNextElement"],
    },
    checkEdge: {
      actions: ["checkEdge"],
    },
    final: {
      actions: ["finalize"],
    },
  },
});
