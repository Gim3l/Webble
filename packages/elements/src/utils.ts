import {
  elementsConfig,
  ElementTypes,
  GroupElement,
  InputElementTypes,
  TYPE_CHOICE_INPUT_ELEMENT,
} from "./elementsConfig";
import {
  TYPE_REQUEST_LOGIC_ELEMENT,
  TYPE_SCRIPT_LOGIC_ELEMENT,
  VideoBubbleGroupElement,
} from "./elements";

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

export function isFromInputsGroup(
  element: unknown,
): element is GroupElement<InputElementTypes> & {
  index: number;
  sent?: { type: "text"; value: string };
} & { data: { variable: string } } {
  return (
    elementsConfig[(element as GroupElement<InputElementTypes>).type].group ===
    "Inputs"
  );
}

/**
 * These are element that stop the chat pipeline. No more elements are captured.
 * @param element
 */
export function isTerminalGroupElement(
  element: unknown,
): element is GroupElement<
  InputElementTypes | typeof TYPE_REQUEST_LOGIC_ELEMENT
> {
  return (
    isFromInputsGroup(element) ||
    (isGroupElementType(element, TYPE_REQUEST_LOGIC_ELEMENT) &&
      !!element.data.runOnClient)
  );
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

export function isGroupElementTypes<T extends ElementTypes>(
  element: unknown,
  types: T[],
): element is GroupElement<T> & {
  index: number;
  sent?: { type: "text"; value: string };
} {
  return types.includes((element as GroupElement).type);
}
