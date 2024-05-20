import { writable } from "svelte/store";
import type { ElementNode } from "@webble/elements";

export let sessionId = writable<string>();
export let formId = writable<string>();

export type ChatMessage = {
  type: "received" | "sent";
  content: { value: string; type: "text" | "image" | "file" };
};

export let messages = writable<ChatMessage[]>([]);

export let currentInput = writable<ElementNode | null>();

type ChatResponse = {
  sessionId?: string;
  input: ElementNode;
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
  const formData = new FormData();

  formData.set("message", String(message));
  formData.set("sessionId", sessionId);

  fetch(`${import.meta.env.VITE_WEBBLE_API_URL}/chat/${formId}`, {
    method: "POST",
    body: formData,
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
  if (data.input) {
    currentInput.set(data.input);
  } else {
    currentInput.set(null);
  }

  if (data.messages) {
    const newMessages = data.messages.map<ChatMessage>((msg) => ({
      type: "received",
      content: { type: "text", value: (msg.data as { text: string }).text },
    }));

    messages.update((currentMessages) => [...currentMessages, ...newMessages]);
  }
  if (data.sessionId) sessionId.set(data.sessionId);
}
