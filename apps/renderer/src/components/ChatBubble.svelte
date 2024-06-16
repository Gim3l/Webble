<script lang="ts">
    import { scale, fade } from "svelte/transition";
    import { circIn, cubicInOut, quintInOut, elasticInOut } from "svelte/easing";
    import { onMount } from "svelte";
    import {
        displayedMessages,
        displayNextCapture,
        messages,
        pendingCaptures,
        formId,
        sessionId,
    } from "../stores";

    export let wasSent: boolean = false;
    export let id: string;

    let showText = false;
    const delay = Math.floor(Math.random() * 3000) + 1;

    onMount(() => {
        setTimeout(() => {
            if (!$displayedMessages.includes(id)) {
                showText = true;

                displayedMessages.update((currentMessages) => {
                    return [...currentMessages, id];
                });
            }
        }, delay); // 0.5 second delay before showing text
    });

    // function displayNextCapture() {
    //     if (!$pendingCaptures.length || wasSent) return;
    //     const capture = $pendingCaptures[0];
    //
    //     if (isGroupElementType(capture, TYPE_SCRIPT_LOGIC_ELEMENT)) {
    //         eval(capture.data.code);
    //     }
    //
    //     pendingCaptures.update((currentCaptures) => {
    //         return [...currentCaptures.slice(1)];
    //     });
    //     messages.update((currentMessages) => {
    //         return [...currentMessages, capture];
    //     });
    // }
</script>

<style>
    .dots {
        display: flex;
    }

    .webble-chat-bubble {
        align-self: start;
        display: inline;
        padding-inline: 14px;
        padding-block: 12px;
        border-radius: var(--webble-radius);
        background: var(--webble-chat-bubble-background);
        color: var(--webble-chat-bubble-text-color);
    }

    .webble-chat-bubble :global(p) {
        margin: 0;
        padding: 0;
    }

    .webble-msg-sent {
        align-self: end;
        background: var(--webble-chat-bubble-sent-background);
        color: var(--webble-chat-bubble-sent-text-color);
    }

    .circle {
        display: block;
        height: 8px;
        width: 8px;
        border-radius: 50%;
        background-color: var(--webble-chat-bubble-text-color);
        margin: 3px;
    }

    .circle.scaling {
        animation: typing 1000ms ease-in-out infinite;
        animation-delay: 3600ms;
    }

    .circle.bouncing {
        animation: bounce 1000ms ease-in-out infinite;
        animation-delay: 3600ms;
    }

    .circle:nth-child(1) {
        animation-delay: 0ms;
    }

    .circle:nth-child(2) {
        animation-delay: 333ms;
    }

    .circle:nth-child(3) {
        animation-delay: 666ms;
    }

    @keyframes typing {
        0% {
            transform: scale(1);
        }
        33% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.4);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes bounce {
        0% {
            transform: translateY(0);
        }
        33% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
        100% {
            transform: translateY(0);
        }
    }
</style>

{#if showText || wasSent || $displayedMessages.includes(id)}
    <div
        in:scale={{
            duration: 200,
            start: 0,
            opacity: 0,
            easing: quintInOut,
        }}
        style="transform-origin: 0 0;"
        class="webble-chat-bubble"
        class:webble-msg-sent={wasSent}
        on:introend={() => {
            displayNextCapture($pendingCaptures, { formId: $formId, sessionId: $sessionId });
        }}>
        <div in:fade={{ duration: 400 }}>
            <slot />
        </div>
    </div>
{:else}
    <div class="webble-chat-bubble" class:webble-msg-sent={wasSent}>
        <div class="dots">
            <span class="circle scaling"></span>
            <span class="circle scaling"></span>
            <span class="circle scaling"></span>
        </div>
    </div>
{/if}
