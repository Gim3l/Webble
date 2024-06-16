import { TYPE_SCRIPT_LOGIC_ELEMENT } from "./index";
import { BaseGroupElement } from "../../../elementsConfig";

export type ScriptLogicElementData = {
  name: string;
  code: string;
};

export type ScriptLogicGroupElement<T = typeof TYPE_SCRIPT_LOGIC_ELEMENT> = {
  type: T;
  data: T extends typeof TYPE_SCRIPT_LOGIC_ELEMENT
    ? ScriptLogicElementData
    : never;
} & BaseGroupElement;
