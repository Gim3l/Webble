import { BaseInputElementData } from "../types";
import { TYPE_CHOICE_INPUT_ELEMENT } from "./index";
import { BaseGroupElement } from "../../../elementsConfig";

export type ChoiceInputElementData = {
  options: { id: string; label: string }[];
} & BaseInputElementData;

export type ChoiceInputGroupElement<T = typeof TYPE_CHOICE_INPUT_ELEMENT> = {
  type: T;
  data: T extends typeof TYPE_CHOICE_INPUT_ELEMENT
    ? ChoiceInputElementData
    : never;
} & BaseGroupElement;
