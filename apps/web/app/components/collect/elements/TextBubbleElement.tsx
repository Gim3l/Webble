import { Stack, Text, TextInput } from "@mantine/core";
import { Node, NodeProps } from "@xyflow/react";
import ElementWrapper from "./ElementWrapper";

import {
  elementsConfig,
  GroupElement,
  TYPE_TEXT_BUBBLE_ELEMENT,
} from "@webble/elements";
import { updateGroupElement } from "~/components/collect/store";

function TextBubbleElement(
  element: GroupElement<typeof TYPE_TEXT_BUBBLE_ELEMENT>,
) {
  return (
    <ElementWrapper
      icon={elementsConfig[element.type].icon}
      groupId=""
      element={element}
      configEl={
        <>
          <Stack gap="sm">
            <TextInput
              label="Placeholder"
              placeholder="Enter "
              variant="filled"
              defaultValue={element.data.text}
              onChange={(e) => {
                updateGroupElement<typeof TYPE_TEXT_BUBBLE_ELEMENT>({
                  ...element,
                  data: { ...element.data, text: e.target.value },
                });
              }}
            />
          </Stack>
        </>
      }
    >
      <Text c={"gray"}>{element.data.text || "Enter text response"}</Text>
    </ElementWrapper>
  );
}

export default TextBubbleElement;
