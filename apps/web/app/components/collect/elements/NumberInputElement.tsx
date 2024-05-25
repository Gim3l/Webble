import { Box, Flex, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import ElementWrapper from "./ElementWrapper";
import { Handle, Position } from "@xyflow/react";
import { updateGroupElement } from "~/components/collect/store";
import {
  TYPE_NUMBER_INPUT_ELEMENT,
  elementsConfig,
  GroupElement,
} from "@webble/elements";
import { useEffect, useRef } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

function NumberInputElement(
  element: GroupElement<typeof TYPE_NUMBER_INPUT_ELEMENT>,
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    invariant(ref.current);

    return draggable({
      element: ref.current,
      canDrag() {
        return false;
      },
    });
  }, [ref]);
  return (
    <Box pos={"relative"}>
      <div ref={ref}>
        <Handle
          type={"target"}
          style={{ left: 0 }}
          position={Position.Left}
          id={element.id}
        ></Handle>
        <Handle
          type={"source"}
          style={{ right: 0 }}
          position={Position.Right}
          id={element.id}
        ></Handle>
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
                updateGroupElement<typeof TYPE_NUMBER_INPUT_ELEMENT>({
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
                updateGroupElement<typeof TYPE_NUMBER_INPUT_ELEMENT>({
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
                updateGroupElement<typeof TYPE_NUMBER_INPUT_ELEMENT>({
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
                updateGroupElement<typeof TYPE_NUMBER_INPUT_ELEMENT>({
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
                updateGroupElement<typeof TYPE_NUMBER_INPUT_ELEMENT>({
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
