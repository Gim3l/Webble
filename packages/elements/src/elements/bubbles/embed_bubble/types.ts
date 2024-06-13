import { TYPE_EMBED_BUBBLE_ELEMENT } from "./index";
import { BaseGroupElement } from "../../../elementsConfig";

export type EmbedBubbleElementData = {
  code: string;
};

export type EmbedBubbleGroupElement<T = typeof TYPE_EMBED_BUBBLE_ELEMENT> = {
  type: T;
  data: T extends typeof TYPE_EMBED_BUBBLE_ELEMENT
    ? EmbedBubbleElementData
    : never;
} & BaseGroupElement;
