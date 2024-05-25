import { runChatPipeline } from "~/lib/chat.pipe";
import { EdgeData, GroupElement, GroupNodeData } from "@webble/elements";
import {
  Edge,
  Node,
  ReactFlowInstance,
  ReactFlowJsonObject,
} from "@xyflow/react";
import { Effect } from "effect";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { getForm } from "~/queries/form.queries";
import { dbClient } from "~/lib/db";
import {
  addToChatHistory,
  createChatSession,
  getChatSession,
  updateChatSession,
} from "~/queries/chat.queries";
import invariant from "tiny-invariant";

const data = {
  edges: [
    {
      id: "ememzf-UyNUchlDyk5XtL",
      source: "start",
      target: "egNn1UJS1QvdkWgfoQ_Fi",
      sourceHandle: "start",
    },
  ],
  nodes: [
    {
      id: "start",
      data: {},
      type: "start",
      measured: {
        width: 194,
        height: 39,
      },
      position: {
        x: 500,
        y: 500,
      },
    },
    {
      id: "egNn1UJS1QvdkWgfoQ_Fi",
      data: {
        name: "Group",
        elements: [
          {
            id: "8cI6Sa9pEQcrrb4PhhJMh",
            data: {
              text: "Hello!",
            },
            type: "text_bubble",
            index: 0,
            groupId: "egNn1UJS1QvdkWgfoQ_Fi",
          },
          {
            id: "-22PYqGeN_ArMAtb54WOi",
            data: {
              text: "Hello!",
            },
            type: "text_bubble",
            index: 1,
            groupId: "egNn1UJS1QvdkWgfoQ_Fi",
          },
          {
            id: "tQDK-BTukryZhomrPxhBj",
            data: {
              variable: "",
              buttonLabel: "Send",
              placeholder: "",
            },
            type: "text_input",
            index: 0,
            groupId: "egNn1UJS1QvdkWgfoQ_Fi",
          },
          {
            id: "243PYqGeN_ArMAtb54WOi",
            data: {
              text: "Hello!",
            },
            type: "text_bubble",
            index: 2,
            groupId: "egNn1UJS1QvdkWgfoQ_Fi",
          },
        ],
      },
      type: "collection",
      dragging: false,
      measured: {
        width: 260,
        height: 337,
      },
      position: {
        x: 818,
        y: 401,
      },
      selected: true,
    },
  ] as Node<GroupNodeData>[],
};

export async function action({ request, params }: ActionFunctionArgs) {
  const form = await getForm.run(dbClient, { id: params.formId as string });
  //TODO: check if form is published
  if (!form) throw json({ error: "Form not found" }, 404);
  const formData = await request.formData();
  const sessionId = formData.get("sessionId") as string;
  const message = (formData.get("message") as string) || "";

  let startingElementId;
  const chatSession = sessionId
    ? await getChatSession.run(dbClient, {
        id: sessionId as string,
      })
    : null;

  if (!chatSession && sessionId) throw json({ message: "Invalid session id" });

  const lastCaptures = chatSession?.history?.[0]?.captures as GroupElement[];
  const lastCapturedEl = lastCaptures?.[lastCaptures?.length - 1];

  if (chatSession) {
    console.log({
      startingElementId,
      lastHistory: JSON.stringify(chatSession.history?.[0]),
    });
  }

  const result = await Effect.runPromise(
    runChatPipeline({
      groups:
        (
          form.structure as ReactFlowJsonObject<Node<GroupNodeData>>
        ).nodes.filter((node) => node.id !== "start") || [],
      lastMessage: message || "",
      lastCapturedEl: lastCapturedEl || null,
      captures: [],
      values: chatSession?.values || {},
      initialLastCapturedEl: null,
      edges:
        (
          form.structure as ReactFlowJsonObject<
            Node<GroupNodeData>,
            Edge<EdgeData>
          >
        ).edges || [],
      group: null,
    }),
  );

  if (sessionId) {
    await dbClient.transaction(async (tx) => {
      await updateChatSession.run(tx, {
        sessionId,
        values: result.values,
      });

      await addToChatHistory.run(tx, {
        captures: result.captures,
        session: sessionId,
        message,
      });
    });
  }

  if (!sessionId) {
    const newSession = await dbClient.transaction(async (tx) => {
      const session = await createChatSession.run(tx, {
        last_group: result.group || {},
        formId: params.formId as string,
      });

      await addToChatHistory.run(tx, {
        captures: result.captures,
        session: session.id,
        message,
      });
      return session;
    });

    return { sessionId: newSession.id, captures: result.captures };
  }

  return { sessionId, captures: result.captures };
}
