import {
  elementsConfig,
  ElementTypes,
  GroupElement,
  TYPE_CHOICE_INPUT_ELEMENT,
} from "./elementsConfig";
import { VideoBubbleGroupElement } from "./elements";

export function isGroupElement<T extends ElementTypes>(
  element: unknown,
): element is GroupElement<T> & { index: number } {
  return (
    Object.keys(elementsConfig).indexOf((element as GroupElement).type) !== -1
  );
}

// elements with choices
export function elementHasOptions<T extends ElementTypes>(
  element: unknown,
): element is GroupElement<typeof TYPE_CHOICE_INPUT_ELEMENT> & {
  index: number;
} {
  return Object.keys((element as GroupElement).data).indexOf("options") !== -1;
}

export function isFromInputsGroup(element: unknown): element is GroupElement<
  "number_input" | "text_input" | "email_input"
> & {
  index: number;
  sent?: { type: "text"; value: string };
} & { data: { variable: string } } {
  return elementsConfig[(element as GroupElement).type].group === "Inputs";
}

export function isGroupElementType<T extends ElementTypes>(
  element: unknown,
  type: T,
): element is GroupElement<T> & {
  index: number;
  sent?: { type: "text"; value: string };
} {
  return (element as GroupElement).type === type;
}
