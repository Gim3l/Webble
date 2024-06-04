import { Node } from "@xyflow/react";
import {
  Icon,
  IconAt,
  IconCheck,
  IconCursorText,
  IconHash,
  IconLivePhoto,
  IconMessage,
  IconMusic,
  IconPhoto,
} from "@tabler/icons-react";
import { nanoid } from "nanoid";
import {
  AudioBubbleElementData,
  ChoiceInputElementData,
  EmailElementData,
  ImageBubbleElementData,
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
export const TYPE_IMAGE_BUBBLE_ELEMENT = "image_bubble";
export const TYPE_AUDIO_BUBBLE_ELEMENT = "audio_bubble";

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
  | {
      type: T;
      data: T extends typeof TYPE_IMAGE_BUBBLE_ELEMENT
        ? ImageBubbleElementData
        : never;
    }
  | {
      type: T;
      data: T extends typeof TYPE_AUDIO_BUBBLE_ELEMENT
        ? AudioBubbleElementData
        : never;
    }
) & { groupId: string; id: string };

export type GroupNodeData = {
  name: string;
  elements: GroupElement[];
};

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

export function isFromInputsGroup(element: unknown): element is GroupElement & {
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
  [TYPE_IMAGE_BUBBLE_ELEMENT]: {
    icon: IconPhoto,
    group: "Bubbles",
    name: "Image",
    default: {
      url: "",
    } satisfies ImageBubbleElementData,
  },
  [TYPE_AUDIO_BUBBLE_ELEMENT]: {
    icon: IconMusic,
    group: "Bubbles",
    name: "Audio",
    default: {
      url: "",
    } satisfies AudioBubbleElementData,
  },
} satisfies ElementsConfigSchema;

export type ElementTypes = keyof typeof elementsConfig;
