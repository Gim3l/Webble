export type NewNodeData = {};

export type BaseInputElementData = {
  variable: string;
};

export type EmailElementData = {
  placeholder: string;
  buttonLabel: string;
} & BaseInputElementData;

export type InputElementData = {
  placeholder: string;
  buttonLabel: string;
} & BaseInputElementData;

export type NumberInputElementData = {
  placeholder: string;
  buttonLabel: string;
  min?: number;
  max?: number;
  step?: number;
} & BaseInputElementData;

export type ChoiceInputElementData = {
  options: { id: string; label: string }[];
} & BaseInputElementData;

export type TextBubbleElementData = {
  text: string;
};

export type ImageBubbleElementData = {
  url: string;
};
