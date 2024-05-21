<script lang="ts">
   import {fade} from "svelte/transition";
   import { afterUpdate } from 'svelte';
   import {circIn} from "svelte/easing";

   export let wasSent: boolean = false;
   export let index: number = 0;
   export let hiddenFor: number = 0;


   let showText = false;

   // afterUpdate(() => {
   //     setTimeout(() => {
   //         showText = true;
   //     }, (hiddenFor * index) - hiddenFor); // 0.5 second delay before showing text
   // });
</script>

<div in:fade={{ delay: wasSent ? 0 : hiddenFor, easing: circIn}} class="webble-chat-bubble" class:webble-msg-sent={wasSent}>
{#if wasSent}
        <slot/>
{:else}
        <!--{#if showText}-->
            <slot/>
            <!--{:else}-->
<!--            <div class="dots">-->
<!--                <span class="circle scaling"></span>-->
<!--                <span class="circle scaling"></span>-->
<!--                <span class="circle scaling"></span>-->
<!--            </div>-->
<!--        {/if}-->
{/if}
</div>

<style>
.dots {
    display: flex;
}
.webble-chat-bubble {
    align-self: start;
    display: inline;
    padding-inline: 14px;
    padding-block: 12px;
    border-radius: 16px;
    background: var(--webble-chat-bubble-background);
    color: var(--webble-chat-bubble-text-color);
}

.webble-msg-sent {
    align-self: end;
    background: var(--webble-chat-bubble-sent-background);
    color: var(--webble-chat-bubble-sent-text-color);
}


.circle {
    display: block;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: #8d8d8d;
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