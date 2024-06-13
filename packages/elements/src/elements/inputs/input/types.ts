import { BaseInputElementData } from "../types";
import { TYPE_INPUT_ELEMENT } from "./index";
import { BaseGroupElement } from "../../../elementsConfig";

export type InputElementData = {
  placeholder: string;
  buttonLabel: string;
} & BaseInputElementData;

export type InputGroupElement<T = typeof TYPE_INPUT_ELEMENT> = {
  type: T;
  data: T extends typeof TYPE_INPUT_ELEMENT ? InputElementData : never;
} & BaseGroupElement;
