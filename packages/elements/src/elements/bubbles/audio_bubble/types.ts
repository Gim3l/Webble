import { TYPE_AUDIO_BUBBLE_ELEMENT } from "./index";
import { BaseGroupElement } from "../../../elementsConfig";

export type AudioBubbleElementData = {
  url: string;
};

export type AudioBubbleGroupElement<T = typeof TYPE_AUDIO_BUBBLE_ELEMENT> = {
  type: T;
  data: T extends typeof TYPE_AUDIO_BUBBLE_ELEMENT
    ? AudioBubbleElementData
    : never;
} & BaseGroupElement;
