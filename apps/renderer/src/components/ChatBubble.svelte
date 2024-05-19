<script lang="ts">
   import {fade} from "svelte/transition";
</script>

<div transition:fade={{ delay: 250, duration: 1000 }} class="webble-chat-bubble">
    <slot/>
</div>

<style>
.webble-chat-bubble {
    display: inline;
    padding-inline: 14px;
    padding-block: 12px;
    border-radius: 16px;
    background: var(--webble-chat-bubble-background);
    color: var(--webble-chat-bubble-text-color);
}
</style>