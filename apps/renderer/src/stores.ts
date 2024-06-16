import { writable } from "svelte/store";
import {
    type GroupElement,
    isFromInputsGroup,
    isGroupElementType,
    TYPE_REQUEST_LOGIC_ELEMENT,
    TYPE_SCRIPT_LOGIC_ELEMENT,
} from "@webble/elements";

export let formId = writable<string>();
export let bubbleConfig = writable<{ loadingDuration: number; transitionDuration: number }>({
    loadingDuration: 1000,
    transitionDuration: 1000,
});

export let sessionId = writable<string>();

export let messages = writable<GroupElement[]>([]);
export let displayedMessages = writable<string[]>([]);
export let pendingCaptures = writable<GroupElement[]>([]);
export let nextElementId = writable<string>();

export let currentInput = writable<GroupElement | null>();

type SentMessage = {
    type: "sent_message";
    content: { value: string; type: "text" };
};

type ChatResponse = {
    sessionId: string;
    formId: string;
    captures: GroupElement[];
};

export function sendMessage(
    {
        message,
        sessionId,
        formId,
        inputId,
    }: {
        message: string | number;
        sessionId: string;
        formId: string;
        inputId?: string;
    },
    cb: (data: ChatResponse) => unknown,
) {
    if (!message) return;
    const formData = new FormData();

    formData.set("message", String(message));
    formData.set("sessionId", sessionId);

    if (inputId) {
        messages.update((currentMessages) => {
            const oldMessages = [...currentMessages].reverse();
            const newMessages = oldMessages
                .map((msg) => {
                    if (isFromInputsGroup(msg) && inputId === msg.id) {
                        return { ...msg, sent: { type: "text", value: message } };
                    }
                    return msg;
                })
                .reverse();

            return [...newMessages];
        });
    }

    fetch(`${import.meta.env.VITE_WEBBLE_API_URL}/engage/${formId}`, {
        method: "POST",
        body: formData,
        headers: {
            Origin: window.location.origin,
        },
    }).then(async (res) => {
        const data = await res.json();
        return cb(data);
    });
}

function runLogic(capture: GroupElement, callbackData?: { sessionId: string; formId: string }) {
    if (isGroupElementType(capture, TYPE_SCRIPT_LOGIC_ELEMENT)) {
        alert("running logic " + capture.type);
        eval(capture.data.code);
    }

    if (isGroupElementType(capture, TYPE_REQUEST_LOGIC_ELEMENT) && callbackData) {
        const { sessionId, formId } = callbackData;
        const url = new URL(capture.data.request.url);
        const keys = capture.data.request.queryParams
            ? Object.keys(capture.data.request.queryParams)
            : [];

        for (const key of keys) {
            const value = capture.data.request.queryParams?.[key];
            if (value) url.searchParams.append(key, value);
        }

        alert(url.toString());
        fetch(url.toString(), {
            method: capture.data.request.method,
            body: capture.data.request.method === "GET" ? undefined : capture.data.request.body,
            headers: capture.data.request.headers,
        }).then(async (res) => {
            sendMessage({ formId, message: await res.text(), sessionId }, (data) => {
                handleReceivedMessage(data);
            });
        });
    }
}

export function handleReceivedMessage(data: ChatResponse, id?: string) {
    if (data.captures?.length) {
        pendingCaptures.set([...(data.captures.slice(1) || [])]);

        for (let [index, capture] of data.captures.slice(0, 1).entries()) {
            let typingTime = 1200;
            let delay = typingTime * index + 1;

            setTimeout(() => {
                runLogic(capture, { sessionId: data.sessionId, formId: data.formId });

                messages.update((currentMessages) => {
                    return [...currentMessages, capture];
                });
            }, delay);
        }
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

export function displayNextCapture(
    currentPendingCaptures: GroupElement[],
    data: { sessionId: string; formId: string },
    wasSent?: boolean,
) {
    if (!currentPendingCaptures.length || wasSent) return;
    const capture = currentPendingCaptures[0];

    runLogic(capture, data);

    pendingCaptures.update((currentCaptures) => {
        return [...currentCaptures.slice(1)];
    });
    messages.update((currentMessages) => {
        return [...currentMessages, capture];
    });
}
