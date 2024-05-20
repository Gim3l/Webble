import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { createActor, Snapshot, waitFor } from "xstate";
import { chatMachine, initialState } from "~/lib/chat.machine";
import {
  createChatSession,
  getChatSession,
  updateChatSession,
} from "~/queries/chat.queries";
import { dbClient } from "~/lib/db";
import { getForm } from "~/queries/form.queries";

const withChoice = {
  nodes: [
    {
      id: "start",
      type: "start",
      data: {},
      position: {
        x: 500,
        y: 500,
      },
      measured: {
        width: 194,
        height: 39,
      },
    },
    {
      type: "number_input",
      data: {
        buttonLabel: "Send",
        placeholder: "",
      },
      id: "3FegXmwbmWv5DSAA-m6rd",
      position: {
        x: 840,
        y: 495,
      },
      measured: {
        width: 194,
        height: 39,
      },
    },
    {
      type: "email_input",
      data: {
        buttonLabel: "Send",
        placeholder: "",
      },
      id: "ei5coZAsKPRGwBph2PUOR",
      position: {
        x: 1153,
        y: 431,
      },
      measured: {
        width: 194,
        height: 39,
      },
      selected: false,
      dragging: false,
    },
    {
      type: "choice_input",
      data: {
        options: [
          {
            id: "9O9akyQl8gttljCvewwVT",
            label: "Test",
          },
        ],
      },
      id: "PXzhcfDanQeaiMqONdEeD",
      position: {
        x: 1470,
        y: 495,
      },
      measured: {
        width: 226,
        height: 109,
      },
    },
    {
      type: "email_input",
      data: {
        buttonLabel: "Send",
        placeholder: "",
      },
      id: "hUtldhUkdszxBkj_iSmfS",
      position: {
        x: 1755,
        y: 675,
      },
    },
  ],
  edges: [
    {
      id: "3nC4EqQ_kWsTirxhS9rNb",
      source: "start",
      target: "3FegXmwbmWv5DSAA-m6rd",
    },
    {
      id: "qbT9FpIK8sqhMEv-LNwQ-",
      source: "3FegXmwbmWv5DSAA-m6rd",
      target: "ei5coZAsKPRGwBph2PUOR",
    },
    {
      id: "rsarFqx1mObrLjh-e7VNW",
      source: "ei5coZAsKPRGwBph2PUOR",
      target: "PXzhcfDanQeaiMqONdEeD",
    },
    {
      id: "fxXRfRJOHojx7KFnvVbE-",
      source: "PXzhcfDanQeaiMqONdEeD",
      target: "hUtldhUkdszxBkj_iSmfS",
      sourceHandle: "9O9akyQl8gttljCvewwVT",
    },
  ],
};

export async function loader({ params }: LoaderFunctionArgs) {
  const actor = createActor(chatMachine, {
    input: { ...initialState, ...withChoice, start: params.start || "" },
  });
  actor.start();
  actor.send({ type: "continueChat" });

  const snapshot = await waitFor(
    actor,
    (snapshot) => {
      return !!snapshot.context.nextElementId;
    },
    { timeout: 10_000 },
  );

  if (!snapshot.context.nextElementId) {
    throw json({ message: "Chat ended" }, { status: 400 });
  }

  return json({ context: snapshot.context });
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

  if (!form) throw json({ error: "Form not valid" }, 400);

  if (!chatSession) {
    const session = await createChatSession.run(dbClient, {
      snapshot: persistedSnapshot,
      formId,
    });

    return json({
      sessionId: session.id,
      nextElementId: snapshot.context.nextElementId,
      input: snapshot.context.input,
      messages: snapshot.context.messages,
    });
  }

  await updateChatSession.run(dbClient, {
    sessionId: chatSession.id,
    snapshot: persistedSnapshot,
  });

  return json({
    sessionId: chatSession.id,
    nextElementId: snapshot.context.nextElementId,
    input: snapshot.context.input,
    messages: snapshot.context.messages,
  });
}
