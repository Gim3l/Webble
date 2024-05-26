<svelte:options customElement="webble-chatbox"   />

<script lang="ts">
  import { crossfade } from 'svelte/transition';
  import {bounceIn, bounceInOut} from 'svelte/easing';
  import ChatContainer from "./components/ChatContainer.svelte";
  import {
    sessionId,
    formId as chatFormId,
    handleReceivedMessage,
    nextElementId, messages, currentInput
  } from "./stores";
  import {createEventDispatcher, onMount} from "svelte";
  export let formId = import.meta.env.PROD ? "" : "552b72ee-1aa9-11ef-9be2-c784356adc1e";
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
      chatFormId.set(formId)
  }

  const dispatch = createEventDispatcher()



  nextElementId.subscribe((id) => {
    if(id) dispatch("targetChange", id);
  })

  // reset the chat
  export function reset() {
    let formData = new FormData();
    formData.set("message", "");
    formData.set("sessionId", "");

    sessionId.set("")
    messages.set([])
    currentInput.set(null)

    fetch(`${import.meta.env.VITE_WEBBLE_API_URL}/engage/${formId}`, {method: "POST", body: formData,
      headers: {
        "Origin": window.location.origin
      }}).then(async (res) => {
      const data = await res.json();
      handleReceivedMessage(data)
      return data
    })
  }

  onMount(() => {
    if(formId && !$sessionId) {
      reset();
    }
  })

</script>

<ChatContainer/>

<style>
  :root {
    height: 100%;
    --webble-chat-background: #F9F9F9;
    --webble-chat-bubble-background: #EAE7EC;
    --webble-chat-bubble-text-color: #202020;

    --webble-chat-bubble-sent-background: #6E56CF;
    --webble-chat-bubble-sent-text-color: #F4F0FE;


    --webble-primary-border: #C2B5F5;

    --webble-radius: 8px;
    --webble-button-background: #6E56CF;
    --webble-button-background-hover: #654DC4;
    --webble-button-background-focus: #654DC4;
    --webble-button-border: #C2B5F5;
    --webble-button-border-focus: #D4CAFE;
    --webble-button-text-color: #F4F0FE;
    --webble-button-padding-inline: 16px;
    --webble-button-padding-block: 8px;
    --webble-button-font-size: 16px;
  }
</style>