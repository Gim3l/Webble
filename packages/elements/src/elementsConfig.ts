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

export const TYPE_INPUT_ELEMENT = "text_input";
export const TYPE_NUMBER_INPUT_ELEMENT = "number_input";
export const TYPE_EMAIL_INPUT_ELEMENT = "email_input";
export const TYPE_CHOICE_INPUT_ELEMENT = "choice_input";
export const TYPE_TEXT_BUBBLE_ELEMENT = "text_bubble";

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
    } satisfies InputElementData,
  },
  [TYPE_NUMBER_INPUT_ELEMENT]: {
    icon: IconHash,
    group: "Inputs",
    name: "Number",
    default: {
      buttonLabel: "Send",
      placeholder: "",
    } satisfies NumberInputElementData,
  },
  [TYPE_EMAIL_INPUT_ELEMENT]: {
    icon: IconAt,
    group: "Inputs",
    name: "Email",
    default: {
      buttonLabel: "Send",
      placeholder: "",
    } satisfies EmailElementData,
  },
  [TYPE_CHOICE_INPUT_ELEMENT]: {
    icon: IconCheck,
    group: "Inputs",
    name: "Options",
    default: {
      options: [{ id: nanoid(), label: "" }],
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
