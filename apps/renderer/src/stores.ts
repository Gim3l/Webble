import { writable } from "svelte/store";
import {
  type ElementNode,
  elementsConfig,
  type GroupElement,
  isFromInputsGroup,
  isGroupElement,
} from "@webble/elements";

export let formId = writable<string>();

export let sessionId = writable<string>();

export let messages = writable<GroupElement[]>([]);
export let nextElementId = writable<string>();

export let currentInput = writable<GroupElement | null>();

type SentMessage = {
  type: "sent_message";
  content: { value: string; type: "text" };
};

type ChatResponse = {
  sessionId?: string;
  captures: GroupElement[];
};

export function sendMessage(
  {
    message,
    sessionId,
    formId,
  }: {
    message: string | number;
    sessionId: string;
    formId: string;
  },
  cb: (data: ChatResponse) => unknown,
) {
  if (!message) return;
  const formData = new FormData();

  formData.set("message", String(message));
  formData.set("sessionId", sessionId);

  messages.update((currentMessages) => {
    const oldMessages = [...currentMessages].reverse();
    const newMessages = oldMessages
      .map((msg) => {
        if (isFromInputsGroup(msg)) {
          return { ...msg, sent: { type: "text", value: message } };
        }
        return msg;
      })
      .reverse();

    return [...newMessages];
  });

  fetch(`${import.meta.env.VITE_WEBBLE_API_URL}/engage/${formId}`, {
    method: "POST",
    body: formData,
    headers: {
      Origin: window.location.origin,
    },
  })
    // .then((res) => {
    //   messages.update((currentMessages) => [...currentMessages]);
    //
    //   return res;
    // })
    .then(async (res) => {
      const data = await res.json();
      return cb(data);
    });
}

export function handleReceivedMessage(data: ChatResponse, id?: string) {
  if (data.captures?.length) {
    messages.update((currentMessages) => {
      return [...currentMessages, ...data.captures];
    });
  }

  if (data.sessionId) sessionId.set(data.sessionId);

  // const lastElement = data.captures[data?.captures.length - 1];
  // if (
  //   isGroupElement(lastElement) &&
  //   elementsConfig[lastElement.type]?.group === "Inputs"
  // ) {
  //   currentInput.set(lastElement);
  // }
}
