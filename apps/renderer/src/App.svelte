<svelte:options customElement="webble-chatbox" />

<script lang="ts">
    import { crossfade } from "svelte/transition";
    import { bounceIn, bounceInOut } from "svelte/easing";
    import ChatContainer from "./components/ChatContainer.svelte";
    import {
        sessionId,
        formId as chatFormId,
        handleReceivedMessage,
        messages,
        currentInput,
        displayedMessages,
    } from "./stores";
    import { createEventDispatcher, onMount } from "svelte";
    export let formId = import.meta.env.PROD ? "" : "9b151416-1f74-11ef-806a-aff45652859b";
    export let inputValue = "";

    // $: {
    //   const inputData = JSON.parse(localStorage.getItem(`webble-input-${formId}`) || "[]")
    //   const allMessages = JSON.parse(localStorage.getItem(`webble-messages-${formId}`) || "[]")
    //   const session = localStorage.getItem(`webble-session-${formId}`)
    //
    //
    //   if(inputData) currentInput.set(inputData);
    //   if(allMessages) messages.set(allMessages);
    //   if(session) sessionId.set(session);
    // }
    //
    $: {
        chatFormId.set(formId);
    }

    const dispatch = createEventDispatcher();

    messages.subscribe((msgs) => {
        if (msgs[msgs.length - 1]?.id) {
            dispatch("targetChange", {
                groupId: msgs[msgs.length - 1].groupId,
                elementId: msgs[msgs.length - 1].id,
            });
        }
    });

    // reset the chat
    export function reset() {
        let formData = new FormData();
        formData.set("message", "");
        formData.set("sessionId", "");

        sessionId.set("");
        messages.set([]);
        displayedMessages.set([]);
        currentInput.set(null);

        fetch(`${import.meta.env.VITE_WEBBLE_API_URL}/engage/${formId}`, {
            method: "POST",
            body: formData,
            headers: {
                Origin: window.location.origin,
            },
        }).then(async (res) => {
            const data = await res.json();
            handleReceivedMessage(data);
            return data;
        });
    }

    onMount(() => {
        if (formId && !$sessionId) {
            reset();
        }
    });
</script>

<style>
    :root {
        height: 100%;
        --webble-chat-background: #f9f9f9;
        --webble-chat-bubble-background: #eae7ec;
        --webble-chat-bubble-text-color: #202020;

        --webble-chat-bubble-sent-background: #6e56cf;
        --webble-chat-bubble-sent-text-color: #f4f0fe;

        --webble-primary-border: #c2b5f5;

        --webble-radius: 6px;
        --webble-button-background: #6e56cf;
        --webble-button-background-hover: #654dc4;
        --webble-button-background-focus: #654dc4;
        --webble-button-border: #c2b5f5;
        --webble-button-border-focus: #d4cafe;
        --webble-button-text-color: #f4f0fe;
        --webble-button-padding-inline: 16px;
        --webble-button-padding-block: 8px;
        --webble-button-font-size: 16px;
    }
</style>

<ChatContainer />
