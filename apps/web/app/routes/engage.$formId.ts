import { runChatPipeline } from "~/lib/chat.pipe";
import { EdgeData, GroupElement, GroupNodeData } from "@webble/elements";
import { Edge, Node, ReactFlowJsonObject } from "@xyflow/react";
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
// await init();

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

  const values = {};
  // const isolate = new ivm.Isolate({ memoryLimit: 128 });
  // await runScript(
  //   `
  //     setVariableValue("age", 200);
  //     await fetch('https://jsonplaceholder.typicode.com/todos/1')
  //   `,
  //   values,
  // ).catch((err) => {
  //   console.log(err);
  // });

  console.log({ values });

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

    return {
      sessionId: newSession.id,
      formId: params.formId as string,
      captures: result.captures,
    };
  }

  return {
    sessionId,
    formId: params.formId as string,
    captures: result.captures,
  };
}
