<script>
    import ChatBubble from "./ChatBubble.svelte";
    import Input from "./Input.svelte";
    import Options from "./Options.svelte";
    import {currentInput, messages} from "../stores";

</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
</svelte:head>


<div class="webble-chat-container">
    <ChatBubble>Test bubble</ChatBubble>
    {#each $messages as message}
        <ChatBubble>{message.content.value}</ChatBubble>
    {/each}

    {JSON.stringify({input: $currentInput})}
    {#if $currentInput}
        {#if $currentInput.type === "choice_input"}
            <Options options={$currentInput.data.options} />
        {/if}

        {#if $currentInput.type === "text_input"}
            <Input placeholder={$currentInput.data.placeholder} buttonLabel={$currentInput.data.buttonLabel}  />
        {/if}

        {#if $currentInput.type === "number_input"}
            <Input type="number" max={$currentInput.data.max}
                   step={$currentInput.data.step}
                   min={$currentInput.data.min} placeholder={$currentInput.data.placeholder}
                   buttonLabel={$currentInput.data.buttonLabel}  />
        {/if}

    {/if}
</div>

<style>
    :root {
        font-family: "Nunito", sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
    }

    .webble-chat-container {
        display: flex;
        padding-inline: 8px;
        gap: 14px;
        flex-direction: column;
        align-items: start;
        background: var(--webble-chat-background);
        height: 100vh;
        width: 100%;
        max-width: 800px;
    }
</style>

