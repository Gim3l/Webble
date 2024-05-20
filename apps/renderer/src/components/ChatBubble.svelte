<script lang="ts">
   import {fade} from "svelte/transition";

   export let wasSent: boolean = false;
</script>

{#if wasSent}
    <div transition:fade={{ delay: 250, duration: 500 }} class="webble-chat-bubble webble-msg-sent">
        <slot/>
    </div>
{:else}
    <div transition:fade={{ delay: 250, duration: 500 }} class="webble-chat-bubble">
        <slot/>
    </div>
{/if}

<style>
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
</style>