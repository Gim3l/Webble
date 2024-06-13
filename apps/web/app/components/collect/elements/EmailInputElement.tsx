import { Box, Stack, Text, TextInput } from "@mantine/core";
import ElementWrapper from "./ElementWrapper";
import { updateGroupElement } from "~/components/collect/store";
import {
  elementsConfig,
  TYPE_EMAIL_INPUT_ELEMENT,
  EmailInputGroupElement,
  variableRegex,
} from "@webble/elements";
import { useRef } from "react";
import { ElementHandles } from "~/components/collect/GroupNode";
import HighlightVariable from "~/components/collect/HighlightVariable";

function EmailInputElement(element: EmailInputGroupElement) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box pos={"relative"}>
      <div ref={ref} draggable={"false"}>
        <ElementHandles targetId={element.id} sourceId={element.id} />
      </div>
      <ElementWrapper
        icon={elementsConfig[TYPE_EMAIL_INPUT_ELEMENT].icon}
        groupId={""}
        element={element}
        configEl={
          <Stack gap="sm">
            <TextInput
              label="Placeholder"
              placeholder="Enter field placeholder"
              variant="filled"
              defaultValue={element.data.placeholder}
              onChange={(e) => {
                updateGroupElement<EmailInputGroupElement>({
                  ...element,
                  data: {
                    ...element.data,
                    placeholder: e.target.value,
                  },
                });
              }}
            />

            <TextInput
              label="Button Label"
              defaultValue={element.data.buttonLabel}
              placeholder="Enter button label"
              variant="filled"
              onChange={(e) => {
                updateGroupElement<EmailInputGroupElement>({
                  ...element,
                  data: {
                    ...element.data,
                    buttonLabel: e.target.value,
                  },
                });
              }}
            />
          </Stack>
        }
      >
        {element.data.placeholder && (
          <HighlightVariable
            c={"gray"}
            highlight={element.data.placeholder.match(variableRegex) || []}
          >
            {element.data.placeholder}
          </HighlightVariable>
        )}
      </ElementWrapper>
    </Box>
  );
}

export default EmailInputElement;
