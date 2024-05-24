import { Node } from "@xyflow/react";
import {
  Icon,
  IconAt,
  IconCheck,
  IconCursorText,
  IconHash,
  IconMessage,
} from "@tabler/icons-react";
import { nanoid } from "nanoid";
import {
  ChoiceInputElementData,
  EmailElementData,
  InputElementData,
  NumberInputElementData,
  TextBubbleElementData,
} from "./element-data-types";

export type EdgeData = {
  conditions: {
    id: string;
    variable: string;
    cond: "=" | "!=";
    value: string;
  }[];
};

export const TYPE_INPUT_ELEMENT = "text_input";
export const TYPE_NUMBER_INPUT_ELEMENT = "number_input";
export const TYPE_EMAIL_INPUT_ELEMENT = "email_input";
export const TYPE_CHOICE_INPUT_ELEMENT = "choice_input";
export const TYPE_TEXT_BUBBLE_ELEMENT = "text_bubble";

export type GroupElement<T extends string = ElementTypes> = (
  | {
      type: T;
      data: T extends typeof TYPE_INPUT_ELEMENT ? InputElementData : never;
    }
  | {
      type: T;
      data: T extends typeof TYPE_NUMBER_INPUT_ELEMENT
        ? NumberInputElementData
        : never;
    }
  | {
      type: T;
      data: T extends typeof TYPE_EMAIL_INPUT_ELEMENT
        ? EmailElementData
        : never;
    }
  | {
      type: T;
      data: T extends typeof TYPE_CHOICE_INPUT_ELEMENT
        ? ChoiceInputElementData
        : never;
    }
  | {
      type: T;
      data: T extends typeof TYPE_TEXT_BUBBLE_ELEMENT
        ? TextBubbleElementData
        : never;
    }
) & { groupId: string; id: string };

export type GroupNodeData = {
  name: string;
  elements: GroupElement[];
};

export function isGroupElement(
  element: unknown,
): element is GroupElement & { index: number } {
  return (
    Object.keys(elementsConfig).indexOf((element as GroupElement).type) !== -1
  );
}

export type ElementNode =
  | Node<InputElementData, typeof TYPE_INPUT_ELEMENT>
  | Node<NumberInputElementData, typeof TYPE_NUMBER_INPUT_ELEMENT>
  | Node<EmailElementData, typeof TYPE_EMAIL_INPUT_ELEMENT>
  | Node<ChoiceInputElementData, typeof TYPE_CHOICE_INPUT_ELEMENT>
  | Node<TextBubbleElementData, typeof TYPE_TEXT_BUBBLE_ELEMENT>;

type ElementsConfigSchema = Record<
  string,
  {
    icon: Icon;
    name: string;
    default: Record<string, unknown>;
    group: "Inputs" | "Bubbles";
  }
>;

export const elementsConfig = {
  [TYPE_INPUT_ELEMENT]: {
    icon: IconCursorText,
    group: "Inputs",
    name: "Input",
    default: {
      buttonLabel: "Send",
      placeholder: "",
      variable: "",
    } satisfies InputElementData,
  },
  [TYPE_NUMBER_INPUT_ELEMENT]: {
    icon: IconHash,
    group: "Inputs",
    name: "Number",
    default: {
      buttonLabel: "Send",
      placeholder: "",
      variable: "",
    } satisfies NumberInputElementData,
  },
  [TYPE_EMAIL_INPUT_ELEMENT]: {
    icon: IconAt,
    group: "Inputs",
    name: "Email",
    default: {
      buttonLabel: "Send",
      placeholder: "",
      variable: "",
    } satisfies EmailElementData,
  },
  [TYPE_CHOICE_INPUT_ELEMENT]: {
    icon: IconCheck,
    group: "Inputs",
    name: "Options",
    default: {
      options: [{ id: nanoid(), label: "" }],
      variable: "",
    } satisfies ChoiceInputElementData,
  },
  [TYPE_TEXT_BUBBLE_ELEMENT]: {
    icon: IconMessage,
    group: "Bubbles",
    name: "Text Bubble",
    default: {
      text: "Hello!",
    } satisfies TextBubbleElementData,
  },
} satisfies ElementsConfigSchema;

export type ElementTypes = keyof typeof elementsConfig;
