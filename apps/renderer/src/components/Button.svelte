<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch("click")
    }
</script>

<button on:click={handleClick} class="webble-button">
    <slot></slot>
</button>

<style>
    .webble-button {
        all: unset;
        flex-grow: 1;
        text-align: center;
        background: var(--webble-button-background);
        color: var(--webble-button-text-color);
        font-size: var(--webble-button-font-size);
        border-radius: var(--webble-radius);
        cursor: pointer;
        border: 1px solid var(--webble-button-border);
        padding-inline: var(--webble-button-padding-inline);
        padding-block: var(--webble-button-padding-block);
    }

    .webble-button:hover {
        background: var(--webble-button-background-hover);
    }

    .webble-button:focus {
        background: var(--webble-button-background-focus);
        border: 1px solid var(--webble-button-border-focus);
    }
</style>