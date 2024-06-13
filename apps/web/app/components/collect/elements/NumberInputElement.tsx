import { Box, Flex, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import ElementWrapper from "./ElementWrapper";
import { updateGroupElement } from "~/components/collect/store";
import {
  TYPE_NUMBER_INPUT_ELEMENT,
  elementsConfig,
  NumberInputGroupElement,
} from "@webble/elements";
import { useRef } from "react";
import { ElementHandles } from "~/components/collect/GroupNode";

function NumberInputElement(element: NumberInputGroupElement) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box pos={"relative"} className={"webble-element"}>
      <div ref={ref} draggable={"false"}>
        <ElementHandles targetId={element.id} sourceId={element.id} />
      </div>

      <ElementWrapper
        groupId=""
        key={element.id}
        element={element}
        icon={elementsConfig[TYPE_NUMBER_INPUT_ELEMENT].icon}
        configEl={
          <Stack gap="sm">
            <TextInput
              label="Placeholder"
              placeholder="Enter field placeholder"
              variant="filled"
              defaultValue={element.data.placeholder}
              onChange={(e) =>
                updateGroupElement<NumberInputGroupElement>({
                  ...element,
                  data: { ...element.data, placeholder: e.target.value },
                })
              }
            />

            <TextInput
              label="Button Label"
              defaultValue={element.data.buttonLabel}
              placeholder="Enter field placeholder"
              variant="filled"
              onChange={(e) =>
                updateGroupElement<NumberInputGroupElement>({
                  ...element,
                  data: { ...element.data, buttonLabel: e.target.value },
                })
              }
            />

            <NumberInput
              label="Min"
              defaultValue={element.data.min}
              placeholder="Enter minimum value"
              variant="filled"
              stepHoldDelay={500}
              stepHoldInterval={100}
              onChange={(v) =>
                updateGroupElement<NumberInputGroupElement>({
                  ...element,
                  data: { ...element.data, min: Number(v) },
                })
              }
            />

            <NumberInput
              label="Max"
              defaultValue={element.data.max}
              placeholder="Enter maximum value"
              variant="filled"
              stepHoldDelay={500}
              stepHoldInterval={100}
              onChange={(v) =>
                updateGroupElement<NumberInputGroupElement>({
                  ...element,
                  data: { ...element.data, max: Number(v) },
                })
              }
            />

            <NumberInput
              label="Step"
              defaultValue={element.data.step}
              placeholder="Step count"
              variant="filled"
              stepHoldDelay={500}
              stepHoldInterval={100}
              onChange={(v) =>
                updateGroupElement<NumberInputGroupElement>({
                  ...element,
                  data: { ...element.data, step: Number(v) },
                })
              }
            />
          </Stack>
        }
      >
        {element.data.placeholder && (
          <Flex gap="sm">
            <Text c={"gray"}>{element.data.placeholder}</Text>
          </Flex>
        )}
      </ElementWrapper>
    </Box>
  );
}

export default NumberInputElement;
