import {
  Icon,
  IconAt,
  IconBrandJavascript,
  IconCheck,
  IconCode,
  IconCursorText,
  IconFileCode,
  IconFileCode2,
  IconFrame,
  IconHash,
  IconMessage,
  IconMusic,
  IconPhoto,
  IconPrism,
  IconScript,
  IconServerBolt,
  IconVideo,
  IconWebhook,
} from "@tabler/icons-react";
import { nanoid } from "nanoid";
import {
  TYPE_IMAGE_BUBBLE_ELEMENT,
  ImageBubbleElementData,
  TYPE_AUDIO_BUBBLE_ELEMENT,
  AudioBubbleElementData,
  TYPE_TEXT_BUBBLE_ELEMENT,
  TextBubbleElementData,
  TYPE_CHOICE_INPUT_ELEMENT,
  ChoiceInputElementData,
  TYPE_INPUT_ELEMENT,
  InputElementData,
  TYPE_EMAIL_INPUT_ELEMENT,
  EmailElementData,
  TYPE_NUMBER_INPUT_ELEMENT,
  NumberInputElementData,
  NumberInputGroupElement,
  EmailInputGroupElement,
  ChoiceInputGroupElement,
  TextBubbleGroupElement,
  ImageBubbleGroupElement,
  AudioBubbleGroupElement,
  TYPE_VIDEO_BUBBLE_ELEMENT,
  VideoBubbleElementData,
  VideoBubbleGroupElement,
  InputGroupElement,
  EmbedBubbleGroupElement,
  TYPE_EMBED_BUBBLE_ELEMENT,
  EmbedBubbleElementData,
  TYPE_REQUEST_LOGIC_ELEMENT,
  RequestLogicElementData,
  RequestLogicGroupElement,
} from "./elements";
import {
  ScriptLogicElementData,
  ScriptLogicGroupElement,
  TYPE_SCRIPT_LOGIC_ELEMENT,
} from "./elements/logic";

export type EdgeData = {
  conditions: {
    id: string;
    variable: string;
    cond: "=" | "!=";
    value: string;
  }[];
};

export type BaseGroupElement = { groupId: string; id: string };

export type GroupElement<T extends ElementTypes = any> =
  | InputGroupElement<T>
  | NumberInputGroupElement<T>
  | EmailInputGroupElement<T>
  | ChoiceInputGroupElement<T>
  | TextBubbleGroupElement<T>
  | ImageBubbleGroupElement<T>
  | AudioBubbleGroupElement<T>
  | EmbedBubbleGroupElement<T>
  | ScriptLogicGroupElement<T>
  | RequestLogicGroupElement<T>
  | VideoBubbleGroupElement<T>;

export type GroupNodeData = {
  name: string;
  elements: GroupElement[];
};

type ElementsConfigSchema = Record<
  string,
  {
    icon: Icon;
    name: string;
    default: Record<string, unknown>;
    group: "Inputs" | "Bubbles" | "Logic";
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
  [TYPE_VIDEO_BUBBLE_ELEMENT]: {
    icon: IconVideo,
    group: "Bubbles",
    name: "Video",
    default: {
      url: "",
    } satisfies VideoBubbleElementData,
  },
  [TYPE_EMBED_BUBBLE_ELEMENT]: {
    icon: IconCode,
    group: "Bubbles",
    name: "Embed",
    default: {
      code: "",
    } satisfies EmbedBubbleElementData,
  },
  [TYPE_SCRIPT_LOGIC_ELEMENT]: {
    icon: IconFileCode2,
    group: "Logic",
    name: "Script",
    default: {
      name: "Custom Script",
      code: "",
    } satisfies ScriptLogicElementData,
  },
  [TYPE_REQUEST_LOGIC_ELEMENT]: {
    icon: IconWebhook,
    group: "Logic",
    name: "HTTP Request",
    default: {
      name: "HTTP Request",
      request: {
        url: "",
      },
    } satisfies RequestLogicElementData,
  },
} satisfies ElementsConfigSchema;

// flexible types for input elements that checks if the element is from inputs group

type KeysByGroup<T, Group extends string> = {
  [K in keyof T]: T[K] extends { group: Group } ? K : never;
}[keyof T];

export type ElementTypes = keyof typeof elementsConfig;

export type InputElementTypes = KeysByGroup<typeof elementsConfig, "Inputs">;
