import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { createActor, Snapshot, waitFor } from "xstate";
import { chatMachine } from "~/lib/chat.machine";
import { cors } from "remix-utils/cors";
import {
  createChatSession,
  getChatSession,
  updateChatSession,
} from "~/queries/chat.queries";
import { dbClient } from "~/lib/db";
import { getForm } from "~/queries/form.queries";
import { formMachine } from "~/lib/form.machine";

export async function loader({ request }: LoaderFunctionArgs) {
  return cors(request, json({}), {
    allowedHeaders: ["*"],
    origin: "*",
    maxAge: 0,
  });
}

export async function action({ params, request }: ActionFunctionArgs) {
  console.log("STARTING");
  const formData = await request.formData();

  const sessionId = ((await formData.get("sessionId")) as string) || "";
  const chatSession = sessionId
    ? await getChatSession.run(dbClient, { id: sessionId })
    : null;

  const message = (formData.get("message") as string) || "";
  const formId = params.formId as string;

  const form = await getForm.run(dbClient, { id: formId });

  console.log({ start: formData.get("start") });

  const actor = createActor(formMachine, {
    snapshot: chatSession?.snapshot as Snapshot<unknown>,
    input: {
      edges: form.structure["edges"],
      groups: form.structure["nodes"],
    },
  });

  actor.start();
  console.log("STARTING");
  actor.send({ type: "set.lastMessage", message });

  const snapshot = await waitFor(
    actor,
    (snapshot) => {
      return snapshot.value === "exit";
    },
    { timeout: 10_000 },
  );

  const persistedSnapshot = actor.getPersistedSnapshot();

  if (!form)
    throw cors(
      request,
      json(
        { error: "Form not valid" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
          },
        },
      ),
      {
        origin: "*",
        maxAge: 0,
      },
    );

  if (!chatSession) {
    const session = await createChatSession.run(dbClient, {
      snapshot: persistedSnapshot,
      formId,
    });

    return cors(
      request,
      json({
        sessionId: session.id,
        captures: snapshot.context.captures,
      }),
      {
        origin: "*",
        maxAge: 0,
      },
    );
  }

  await updateChatSession.run(dbClient, {
    sessionId: chatSession.id,
    snapshot: persistedSnapshot,
  });

  return cors(
    request,
    json({
      sessionId: chatSession.id,
      captures: snapshot.context.captures,
    }),
    { origin: "*", maxAge: 0 },
  );
}
