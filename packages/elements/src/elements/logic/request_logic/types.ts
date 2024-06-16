import { TYPE_REQUEST_LOGIC_ELEMENT } from "./index";
import { BaseGroupElement } from "../../../elementsConfig";

export type RequestLogicElementData = {
  name: string;
  request: {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
    body?: string;
  };
  runOnClient?: boolean;
};

export type RequestLogicGroupElement<T = typeof TYPE_REQUEST_LOGIC_ELEMENT> = {
  type: T;
  data: T extends typeof TYPE_REQUEST_LOGIC_ELEMENT
    ? RequestLogicElementData
    : never;
} & BaseGroupElement;
