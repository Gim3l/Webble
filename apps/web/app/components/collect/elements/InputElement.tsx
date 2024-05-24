import { Box, Stack, Text, TextInput } from "@mantine/core";

import ElementWrapper from "./ElementWrapper";
import { updateGroupElement } from "~/components/collect/store";
import {
  TYPE_INPUT_ELEMENT,
  elementsConfig,
  GroupElement,
} from "@webble/elements";

import { ElementHandles } from "~/components/collect/GroupNode";

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
            <TextInput
              label="Placeholder"
              placeholder="Enter field placeholder"
              variant="filled"
              defaultValue={element.data.placeholder}
              onChange={(e) => {
                updateGroupElement<typeof TYPE_INPUT_ELEMENT>({
                  ...element,
                  data: { ...element.data, placeholder: e.target.value },
                });
              }}
            />

            <TextInput
              label="Button Label"
              defaultValue={element.data.buttonLabel}
              placeholder="Enter button label"
              variant="filled"
              onChange={(e) =>
                updateGroupElement<typeof TYPE_INPUT_ELEMENT>({
                  ...element,
                  data: { ...element.data, buttonLabel: e.target.value },
                })
              }
            />
          </Stack>
        }
      >
        {element.data.placeholder && (
          <Text c={"gray"}>{element.data.placeholder}</Text>
        )}
      </ElementWrapper>
    </Box>
  );
}

export default InputElement;
