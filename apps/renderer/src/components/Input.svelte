<script lang="ts">
    import Button from "./Button.svelte";
    import { formId, handleReceivedMessage, sendMessage, sessionId } from "../stores";
    export let id: string;
    export let placeholder: string = "Type something...";
    export let buttonLabel: string = "Send";
    export let type: "number" | "text" | "email" = "text";
    export let min: number | undefined = undefined;
    export let max: number | undefined = undefined;
    export let step: number | undefined = undefined;
    let message: string | number;

    // function sendMessageOnEnter(e: KeyboardEvent) {
    //     if (e.key === "Enter") {
    //         sendMessage(
    //             { formId: $formId, message, sessionId: $sessionId, inputId: id },
    //             (data) => {
    //                 handleReceivedMessage(data, id);
    //                 message = "";
    //             },
    //         );
    //     }
    // }

    function handleSubmit(e: Event) {
        e.preventDefault();
        sendMessage({ formId: $formId, message, sessionId: $sessionId, inputId: id }, (data) => {
            handleReceivedMessage(data, id);
            message = "";
        });
    }
</script>

<style>
    .input-wrapper {
        display: flex;
        /*width: 50%;*/
        align-self: end;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .webble-input {
        display: block;
        padding: 1rem;
        flex-grow: 2;
        color: #1f2937;
        border: none;

        background-color: #f3f4f6;
        font-size: 1rem;
        outline-offset: 2px;
        outline: 2px solid transparent;
        box-shadow:
            0 0 #0000,
            0 0 #0000,
            0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    /*.webble-input:focus {*/
    /*    outline: 2px solid var(--webble-primary-border);*/
    /*    outline-offset: 8px;*/
    /*    border-color: 2px solid var(--webble-primary-border);*/
    /*}*/
</style>

<form class="input-wrapper" on:submit={handleSubmit}>
    {#if type === "number"}
        <input
            autofocus
            min={min}
            max={max}
            step={step}
            type="number"
            placeholder={placeholder}
            class="webble-input"
            required
            bind:value={message} />
    {:else if type === "text"}
        <input autofocus placeholder={placeholder} class="webble-input" bind:value={message} />
    {:else if type === "email"}
        <input
            autofocus
            placeholder={placeholder}
            autocomplete="email"
            type="email"
            class="webble-input"
            required
            bind:value={message} />
    {/if}
    <Button type="submit" --webble-radius="0px">{buttonLabel}</Button>
</form>
