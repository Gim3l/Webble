import { Box, Highlight, Stack, Text, TextInput } from "@mantine/core";

import ElementWrapper from "./ElementWrapper";
import { updateGroupElement } from "~/components/collect/store";
import {
  TYPE_INPUT_ELEMENT,
  elementsConfig,
  GroupElement,
} from "@webble/elements";

import { ElementHandles } from "~/components/collect/GroupNode";
import VariableInput from "~/components/VariableInput";
import HighlightVariable from "~/components/collect/HighlightVariable";

function InputElement(element: GroupElement<typeof TYPE_INPUT_ELEMENT>) {
  return (
    <Box pos={"relative"}>
      <ElementHandles targetId={element.id} sourceId={element.id} />
      <ElementWrapper
        icon={elementsConfig[element.type].icon}
        groupId=""
        element={element}
        configEl={
          <Stack gap="sm">
            <VariableInput
              label="Placeholder"
              placeholder="Enter field placeholder"
              variant="filled"
              defaultValue={element.data.placeholder}
              onChange={(e) => {
                updateGroupElement<typeof TYPE_INPUT_ELEMENT>({
                  ...element,
                  data: { ...element.data, placeholder: e.currentTarget.value },
                });
              }}
              onOptionSubmit={(value) => {
                updateGroupElement<typeof TYPE_INPUT_ELEMENT>({
                  ...element,
                  data: { ...element.data, placeholder: value },
                });
              }}
            />

            <VariableInput
              label="Placeholder"
              placeholder="Enter field placeholder"
              variant="filled"
              defaultValue={element.data.placeholder}
              onChange={(e) => {
                updateGroupElement<typeof TYPE_INPUT_ELEMENT>({
                  ...element,
                  data: { ...element.data, buttonLabel: e.currentTarget.value },
                });
              }}
              onOptionSubmit={(value) => {
                updateGroupElement<typeof TYPE_INPUT_ELEMENT>({
                  ...element,
                  data: { ...element.data, buttonLabel: value },
                });
              }}
            />
          </Stack>
        }
      >
        {element.data.placeholder && (
          <HighlightVariable
            c={"gray"}
            highlight={
              element.data.placeholder.match(/{([^{}\s][^{}]*)}/g) || []
            }
          >
            {element.data.placeholder}
          </HighlightVariable>
        )}
      </ElementWrapper>
    </Box>
  );
}

export default InputElement;
