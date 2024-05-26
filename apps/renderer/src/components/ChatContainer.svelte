<script>
    import ChatBubble from "./ChatBubble.svelte";
    import Input from "./Input.svelte";
    import Options from "./Options.svelte";
    import {currentInput, messages} from "../stores";
    import {isFromInputsGroup, isGroupElement, isGroupElementType, TYPE_TEXT_BUBBLE_ELEMENT} from "@webble/elements";

    const scrollToBottom = node => {
        const scroll = () => node.scroll({
            top: node.scrollHeight,
            behavior: 'smooth',
        });
        scroll();

        return { update: scroll }
    };
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
</svelte:head>


<div class="webble-chat-container" use:scrollToBottom={$messages}>
    {#each $messages as message, index}
        {#if isGroupElementType(message, "text_bubble")}
            <ChatBubble  index={index}  hiddenFor={(250*index) - (index * 25)}>{message.data.text}</ChatBubble>
        {/if}

        {#if isFromInputsGroup(message)}
            {#if isGroupElement(message) && message?.sent?.value}
                <ChatBubble wasSent  index={index}  hiddenFor={(250*index) - (index * 25)}>{message.sent.value}</ChatBubble>
            {:else}
                {#if isGroupElementType(message, "choice_input")}
                    <Options id={message.id} options={message.data.options} />
                {/if}

                {#if isGroupElementType(message, "text_input")}
                    <Input id={message.id} placeholder={message.data.placeholder} buttonLabel={message.data.buttonLabel}  />
                {/if}

                {#if isGroupElementType(message, "number_input")}
                    <Input type="number" max={message.data.max}
                           id={message.id}
                           step={message.data.step}
                           min={message.data.min} placeholder={message.data.placeholder}
                           buttonLabel={message.data.buttonLabel}  />
                {/if}

                {#if isGroupElementType(message, "email_input")}
                    <Input id="email_input" type="email" placeholder={message.data.placeholder}
                           buttonLabel={message.data.buttonLabel}  />
                {/if}
            {/if}
        {/if}
    {/each}
</div>

<style>
    :root {
        font-family: "Nunito", sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
    }

    .webble-chat-container {
        box-sizing: border-box;
        display: flex;
        padding: 14px;
        overflow-y: auto;
        gap: 14px;
        flex-direction: column;
        align-items: start;
        background: var(--webble-chat-background);
        min-height: var(--webble-chat-container-min-height);
        width: 100%;
        max-width: 800px;
    }
</style>

