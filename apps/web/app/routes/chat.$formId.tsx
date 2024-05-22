import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { createActor, Snapshot, waitFor } from "xstate";
import { chatMachine } from "~/lib/chat.machine";
import {
  createChatSession,
  getChatSession,
  updateChatSession,
} from "~/queries/chat.queries";
import { dbClient } from "~/lib/db";
import { getForm } from "~/queries/form.queries";

export async function loader() {
  return json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
    },
  );
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const sessionId = ((await formData.get("sessionId")) as string) || "";
  const chatSession = sessionId
    ? await getChatSession.run(dbClient, { id: sessionId })
    : null;

  const message = (formData.get("message") as string) || "";
  const formId = params.formId as string;

  const form = await getForm.run(dbClient, { id: formId });

  console.log({ start: formData.get("start") });

  const actor = createActor(chatMachine, {
    snapshot: chatSession?.snapshot as Snapshot<unknown>,
    input: {
      edges: form.structure["edges"],
      elements: form.structure["nodes"],
      values: {},
    },
  });

  actor.start();
  actor.send({ type: "continueChat", message });

  const snapshot = await waitFor(
    actor,
    (snapshot) => {
      return !!snapshot.context.nextElementId;
    },
    { timeout: 10_000 },
  );

  // we need to reset messages so the initial event doesn't start at the
  // last message node
  actor.send({ type: "resetMessages" });

  const persistedSnapshot = actor.getPersistedSnapshot();

  if (!form)
    throw json(
      { error: "Form not valid" },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
      },
    );

  if (!chatSession) {
    const session = await createChatSession.run(dbClient, {
      snapshot: persistedSnapshot,
      formId,
    });

    return json(
      {
        sessionId: session.id,
        nextElementId: snapshot.context.nextElementId,
        input: snapshot.context.input,
        messages: snapshot.context.messages,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
      },
    );
  }

  await updateChatSession.run(dbClient, {
    sessionId: chatSession.id,
    snapshot: persistedSnapshot,
  });

  return json(
    {
      sessionId: chatSession.id,
      nextElementId: snapshot.context.nextElementId,
      input: snapshot.context.input,
      messages: snapshot.context.messages,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
    },
  );
}
