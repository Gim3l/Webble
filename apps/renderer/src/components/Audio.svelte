<script lang="ts">
    export let url: string = "";
</script>

<style>
    audio::-webkit-media-controls-panel {
        background-color: var(--webble-chat-bubble-background);
    }

    audio::-webkit-media-controls-time-remaining-display {
        color: var(--webble-chat-bubble-text-color);
    }

    audio::-webkit-media-controls-current-time-display {
        color: var(--webble-chat-bubble-text-color);
        -webkit-filter: blur(0px);
    }

    audio::-webkit-media-controls-play-button {
        background-color: var(--webble-chat-bubble-background);
        color: var(--webble-chat-bubble-text-color);
        border-radius: 50%;
    }

    audio::-webkit-media-controls-mute-button {
        background-color: var(--webble-chat-bubble-background);
        color: var(--webble-chat-bubble-text-color);
        border-radius: 50%;
    }

    audio::-webkit-media-controls-timeline {
        background-color: var(--webble-chat-bubble-background);
        border-radius: 25px;
        margin-left: 10px;
        margin-right: 10px;
    }
</style>

<audio controls src={url} />
