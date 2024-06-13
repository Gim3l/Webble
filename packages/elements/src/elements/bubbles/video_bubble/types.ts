import { TYPE_VIDEO_BUBBLE_ELEMENT } from "./index";
import { BaseGroupElement } from "../../../elementsConfig";

export type VideoType = "youtube" | "vimeo" | "tiktok" | "direct";

export type VideoData = {
  type: VideoType | null;
  videoId: string;
  videoSrc: string;
};

export type VideoBubbleElementData = {
  url: string;
};

export type VideoBubbleGroupElement<T = typeof TYPE_VIDEO_BUBBLE_ELEMENT> = {
  type: T;
  data: T extends typeof TYPE_VIDEO_BUBBLE_ELEMENT
    ? VideoBubbleElementData
    : never;
} & BaseGroupElement;
