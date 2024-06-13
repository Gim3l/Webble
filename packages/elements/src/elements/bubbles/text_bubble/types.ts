import { TYPE_TEXT_BUBBLE_ELEMENT } from "./index";
import { BaseGroupElement } from "../../../elementsConfig";

export type TextBubbleElementData = {
  text: string;
};

export type TextBubbleGroupElement<T = typeof TYPE_TEXT_BUBBLE_ELEMENT> = {
  type: T;
  data: T extends typeof TYPE_TEXT_BUBBLE_ELEMENT
    ? TextBubbleElementData
    : never;
} & BaseGroupElement;
