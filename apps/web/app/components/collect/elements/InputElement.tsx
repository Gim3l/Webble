import { Box, Stack } from "@mantine/core";

import ElementWrapper from "./ElementWrapper";
import { updateGroupElement } from "~/components/collect/store";
import { elementsConfig, InputGroupElement } from "@webble/elements";

import { ElementHandles } from "~/components/collect/GroupNode";
import VariableInput from "~/components/VariableInput";
import HighlightVariable from "~/components/collect/HighlightVariable";

function InputElement(element: InputGroupElement) {
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
                updateGroupElement<InputGroupElement>({
                  ...element,
                  data: { ...element.data, placeholder: e.currentTarget.value },
                });
              }}
              onOptionSubmit={(value) => {
                updateGroupElement<InputGroupElement>({
                  ...element,
                  data: { ...element.data, placeholder: value },
                });
              }}
            />

            <VariableInput
              label="Button Label"
              placeholder="Enter button label"
              variant="filled"
              defaultValue={element.data.buttonLabel}
              onChange={(e) => {
                updateGroupElement<InputGroupElement>({
                  ...element,
                  data: { ...element.data, buttonLabel: e.currentTarget.value },
                });
              }}
              onOptionSubmit={(value) => {
                updateGroupElement<InputGroupElement>({
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
