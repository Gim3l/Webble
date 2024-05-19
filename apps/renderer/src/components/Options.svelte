<script lang="ts">
import Button from "./Button.svelte";
import type {ChoiceInputElementData} from "@webble/elements";
import {sendMessage, formId, sessionId, handleReceivedMessage} from "../stores";
export let options: ChoiceInputElementData["options"] = []
</script>

<div class="options-container">
    {#each options as option}
        {#if option}
            <Button on:click={() => {
                sendMessage({formId: $formId, message: option.label, sessionId: $sessionId}, (data) => handleReceivedMessage(data))
            }}>{option.label}</Button>
        {/if}
    {/each}
</div>



<style>
    .options-container  {
        font-size: 14px;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        align-self: end;

    }
</style>
