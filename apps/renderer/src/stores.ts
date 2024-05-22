import { writable } from "svelte/store";
import type { ElementNode } from "@webble/elements";

export let formId = writable<string>();

export let sessionId = writable<string>();

export let messages = writable<ChatMessage[]>([]);
export let nextElementId = writable<string>();

export let currentInput = writable<ElementNode | null>(
  JSON.parse(localStorage.getItem(`webble-input`) || "{}"),
);

export type ChatMessage =
  | {
      type: "sent";
      content: { value: string; type: "text" | "image" | "file" };
    }
  | {
      id: string;
      type: "received";
      content: { value: string; type: "text" | "image" | "file" };
    };

type ChatResponse = {
  sessionId?: string;
  input: ElementNode;
  nextElementId: string;
  messages: ElementNode[];
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

  fetch(`${import.meta.env.VITE_WEBBLE_API_URL}/chat/${formId}`, {
    method: "POST",
    body: formData,
    headers: {
      Origin: window.location.origin,
    },
  })
    .then((res) => {
      messages.update((currentMessages) => [
        ...currentMessages,
        { type: "sent", content: { value: String(message), type: "text" } },
      ]);

      return res;
    })
    .then(async (res) => {
      const data = await res.json();
      return cb(data);
    });
}

export function handleReceivedMessage(data: ChatResponse) {
  if (data.nextElementId) nextElementId.set(data.nextElementId);
  console.log("NEXt", data.nextElementId);

  if (data.input) {
    currentInput.set(data.input);
  } else {
    currentInput.set(null);
    localStorage.removeItem(`webble-input-${formId}`);
  }

  if (data.messages?.length) {
    const newMessages = data.messages.map<ChatMessage>((msg) => ({
      id: msg.id,
      type: "received",
      content: {
        type: "text",
        value: (msg.data as { text: string }).text,
      },
    }));

    messages.update((currentMessages) => [...currentMessages, ...newMessages]);
  }
  if (data.sessionId) sessionId.set(data.sessionId);
}
