import { BaseInputElementData } from "../types";
import { TYPE_NUMBER_INPUT_ELEMENT } from "./index";
import { BaseGroupElement } from "../../../elementsConfig";

export type NumberInputElementData = {
  placeholder: string;
  buttonLabel: string;
  min?: number;
  max?: number;
  step?: number;
} & BaseInputElementData;

export type NumberInputGroupElement<T = typeof TYPE_NUMBER_INPUT_ELEMENT> = {
  type: T;
  data: T extends typeof TYPE_NUMBER_INPUT_ELEMENT
    ? NumberInputElementData
    : never;
} & BaseGroupElement;
