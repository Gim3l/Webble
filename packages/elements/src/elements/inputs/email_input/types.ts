import { BaseInputElementData } from "../types";
import { TYPE_EMAIL_INPUT_ELEMENT } from "./index";
import { BaseGroupElement } from "../../../elementsConfig";

export type EmailElementData = {
  placeholder: string;
  buttonLabel: string;
} & BaseInputElementData;

export type EmailInputGroupElement<T> = {
  type: T;
  data: T extends typeof TYPE_EMAIL_INPUT_ELEMENT ? EmailElementData : never;
} & BaseGroupElement;
