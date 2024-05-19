<svelte:options customElement="webble-chatbox" />

<script lang="ts">
  import ChatContainer from "./components/ChatContainer.svelte";
  import {currentInput, sessionId, formId as chatFormId, handleReceivedMessage} from "./stores";
  export let formId = "";
  export let inputValue = "";

  $: {
    chatFormId.set(formId)
  }

  $: {
    let formData = new FormData();
    formData.set("message", "");
    formData.set("sessionId", "");

    if(formId) {
      fetch(`${import.meta.env.VITE_WEBBLE_API_URL}/chat/${formId}`, {method: "POST", body: formData }).then(async (res) => {
        const data = await res.json();
        handleReceivedMessage(data)
        return data
      })
    }
  }

</script>

<div>
  <div>
    Session: {$sessionId}
  </div>
  <input bind:value={inputValue} placeholder="Enter form id" />
  <button on:click={() => formId = inputValue}>Start</button>
  <ChatContainer/>
</div>

<style>
  :root {
    --webble-chat-background: #F9F9F9;
    --webble-chat-bubble-background: #EAE7EC;
    --webble-chat-bubble-text-color: #202020;


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