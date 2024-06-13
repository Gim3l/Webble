import { VideoData } from "./types";

export * from "./types";
export const TYPE_VIDEO_BUBBLE_ELEMENT = "video_bubble";

const vimeoRegex = new RegExp(
  "https?://(?:www\\.)?vimeo\\.com/(\\d+)(?:/([a-zA-Z0-9]+))?(?:\\?([a-zA-Z0-9=&]+))?",
);

const youtubeRegex = new RegExp(
  "^https?://(?:www.|m.|)(?:youtu.be/|youtube.com/(?:[w-]+?v=|embed/|v/|user/S+|[^/]+?v=))([^&\n]+)",
);

const tiktokRegex = new RegExp(
  "https?://(?:www\\.)?tiktok\\.com/(@[a-zA-Z0-9._]+)/video/(\\d+)",
);

const oneDriveRegex = new RegExp(
  "^https?://(?:www.)?onedrive.live.com/(?:redir)??resid=([^&]+)&authkey=([^&]+)",
);

export function parseVideoUrl(url: string): VideoData {
  if (youtubeRegex.test(url)) {
    const id = url.match(youtubeRegex)?.[1];
    if (id) {
      return {
        videoId: id,
        type: "youtube",
        videoSrc: `https://www.youtube.com/embed/${id}`,
      };
    }
  }
  if (vimeoRegex.test(url)) {
    const id = url.match(vimeoRegex)?.[1];
    const h = url.match(vimeoRegex)?.[2];
    if (id) {
      return {
        type: "vimeo",
        videoId: id,
        videoSrc: h
          ? `https://player.vimeo.com/video/${id}?h=${h}`
          : `https://player.vimeo.com/video/${id}`,
      };
    }
  }
  if (tiktokRegex.test(url)) {
    const id = url.match(tiktokRegex)?.[2];
    if (id) {
      return {
        type: "tiktok",
        videoId: id,
        videoSrc: `https://www.tiktok.com/embed/${id}`,
      };
    }
  }

  if (oneDriveRegex.test(url)) {
    const id = url.match(oneDriveRegex)?.[1];
    const authKey = url.match(oneDriveRegex)?.[2];
    if (id && authKey) {
      return {
        type: "direct",
        videoId: id,
        videoSrc: `https://onedrive.live.com/redir?resid=${id}&authkey=${authKey}`,
      };
    }
  }

  return {
    type: "direct",
    videoSrc: url,
    videoId: "",
  };
}

export function generateVideoEmbed(videoData: VideoData): string {
  switch (videoData.type) {
    case "youtube":
      return `<iframe width="100%" height="auto" src="${videoData.videoSrc}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    case "vimeo":
      return `<iframe src="${videoData.videoSrc}" width="100%" height="auto" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    // case "tiktok":
    //   return `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@zachking/video/6749520869598481669" data-video-id="6749520869598481669" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@zachking" href="https://www.tiktok.com/@zachking?refer=embed">@zachking</a> Do you see the glass as half full or half empty?? <a title="perspective" target="_blank" href="https://www.tiktok.com/tag/perspective?refer=embed">#perspective</a> <a title="magic" target="_blank" href="https://www.tiktok.com/tag/magic?refer=embed">#magic</a> <a target="_blank" title="♬ Glass Half Full Zach King - Zach King" href="https://www.tiktok.com/music/Glass-Half-Full-Zach-King-6749517306881248005?refer=embed">♬ Glass Half Full Zach King - Zach King</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>`;
    case "direct":
      return `<video src="${videoData.videoSrc}" width="100%" height="auto" controls></video>`;
    default:
      return "";
  }
}
