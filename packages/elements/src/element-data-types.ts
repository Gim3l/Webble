export type NewNodeData = {};
export type EmailElementData = {
  placeholder: string;
  buttonLabel: string;
};

export type InputElementData = {
  placeholder: string;
  buttonLabel: string;
};

export type NumberInputElementData = {
  placeholder: string;
  buttonLabel: string;
  min?: number;
  max?: number;
  step?: number;
};

export type ChoiceInputElementData = {
  options: { id: string; label: string }[];
};

export type TextBubbleElementData = {
  text: string;
};
