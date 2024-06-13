<script>
    import ChatBubble from "./ChatBubble.svelte";
    import Input from "./Input.svelte";
    import Options from "./Options.svelte";
    import { bubbleConfig, currentInput, messages } from "../stores";
    import { fade } from "svelte/transition";
    import animejs from "animejs/lib/anime.es";
    import {
        generateVideoEmbed,
        isFromInputsGroup,
        isGroupElement,
        isGroupElementType,
        parseVideoUrl,
        TYPE_TEXT_BUBBLE_ELEMENT,
    } from "@webble/elements";
    import Audio from "./Audio.svelte";

    const scrollToBottom = (node) => {
        const scroll = () =>
            node.scroll({
                top: node.scrollHeight,
                behavior: "smooth",
            });
        scroll();

        return { update: scroll };
    };
</script>

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

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
        href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
        rel="stylesheet" />
</svelte:head>

<div class="webble-chat-container" use:scrollToBottom>
    {#each $messages as message, index}
        {#if isGroupElementType(message, "text_bubble")}
            <ChatBubble id={message.id} index={index}>{@html message.data.text}</ChatBubble>
        {/if}

        {#if isGroupElementType(message, "image_bubble")}
            <ChatBubble id={message.id} index={index}
                ><img
                    style="max-height: 448px"
                    src={message.data.url}
                    width="100%"
                    height="auto"
                    alt="Chat item" /></ChatBubble>
        {/if}

        {#if isGroupElementType(message, "audio_bubble")}
            <ChatBubble id={message.id} index={index}>
                <Audio url={message.data.url} />
            </ChatBubble>
        {/if}

        {#if isGroupElementType(message, "video_bubble")}
            <ChatBubble id={message.id} index={index}
                >{@html generateVideoEmbed(parseVideoUrl(message.data.url))}</ChatBubble>
        {/if}

        {#if isFromInputsGroup(message)}
            {#if isGroupElement(message) && message?.sent?.value}
                <ChatBubble id={message.id} wasSent index={index}>{message.sent.value}</ChatBubble>
            {:else}
                {#if isGroupElementType(message, "choice_input")}
                    <Options id={message.id} options={message.data.options} />
                {/if}

                {#if isGroupElementType(message, "text_input")}
                    <Input
                        id={message.id}
                        placeholder={message.data.placeholder}
                        buttonLabel={message.data.buttonLabel} />
                {/if}

                {#if isGroupElementType(message, "number_input")}
                    <Input
                        type="number"
                        max={message.data.max}
                        id={message.id}
                        step={message.data.step}
                        min={message.data.min}
                        placeholder={message.data.placeholder}
                        buttonLabel={message.data.buttonLabel} />
                {/if}

                {#if isGroupElementType(message, "email_input")}
                    <Input
                        id={message.id}
                        type="email"
                        placeholder={message.data.placeholder}
                        buttonLabel={message.data.buttonLabel} />
                {/if}
            {/if}
        {/if}
    {/each}
</div>
