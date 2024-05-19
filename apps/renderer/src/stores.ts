import { writable } from "svelte/store";
import type { ElementNode } from "@webble/elements";

export let sessionId = writable<string>();
export let formId = writable<string>();

export let messages = writable<
  {
    type: "received" | "sent";
    element: ElementNode;
    content: { value: string; type: "text" | "image" | "file" };
  }[]
>([]);

export let currentInput = writable<ElementNode | null>();

type ChatResponse = {
  sessionId?: string;
  input: ElementNode;
  bubbles: ElementNode[];
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
  }).then(async (res) => {
    const data = await res.json();
    return cb(data);
  });
}

export function handleReceivedMessage(data: ChatResponse) {
  if (data.input) {
    currentInput.set(data.input);
  }
  if (data.sessionId) sessionId.set(data.sessionId);
}
