import { Box, Flex, Stack, Text, TextInput } from "@mantine/core";
import { Handle, Position } from "@xyflow/react";
import ElementWrapper from "./ElementWrapper";
import { updateNode } from "~/components/collect/store";
import {
  elementsConfig,
  TYPE_EMAIL_INPUT_ELEMENT,
  GroupElement,
  TYPE_NUMBER_INPUT_ELEMENT,
} from "@webble/elements";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
// import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

function EmailInputElement(
  element: GroupElement<typeof TYPE_NUMBER_INPUT_ELEMENT>,
) {
  const ref = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   invariant(ref.current);
  //
  //   return draggable({
  //     element: ref.current,
  //     canDrag() {
  //       return false;
  //     },
  //   });
  // }, [ref]);

  return (
    <Box pos={"relative"}>
      <div ref={ref} draggable={"false"}>
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
                updateNode<(typeof element)["data"]>(element.id, {
                  ...element.data,
                  placeholder: e.target.value,
                });
              }}
            />

            <TextInput
              label="Button Label"
              defaultValue={element.data.buttonLabel}
              placeholder="Enter button label"
              variant="filled"
              onChange={(e) => {
                updateNode<(typeof element)["data"]>(element.id, {
                  ...element.data,
                  buttonLabel: e.target.value,
                });
              }}
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

export default EmailInputElement;
