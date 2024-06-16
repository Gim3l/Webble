<script lang="ts">
    import { onMount } from "svelte";
    import { displayNextCapture, sessionId, formId, pendingCaptures } from "../stores";

    onMount(() => {
        displayNextCapture($pendingCaptures, { formId: $formId, sessionId: $sessionId });
    });
</script>
