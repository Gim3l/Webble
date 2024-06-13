import { TYPE_IMAGE_BUBBLE_ELEMENT } from "./index";
import { BaseGroupElement } from "../../../elementsConfig";

export type ImageBubbleElementData = {
  url: string;
};

export type ImageBubbleGroupElement<T = typeof TYPE_IMAGE_BUBBLE_ELEMENT> = {
  type: T;
  data: T extends typeof TYPE_IMAGE_BUBBLE_ELEMENT
    ? ImageBubbleElementData
    : never;
} & BaseGroupElement;
