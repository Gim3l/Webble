import { Flex, Stack, Text, TextInput } from "@mantine/core";
import { Node } from "@xyflow/react";

import ElementWrapper from "./ElementWrapper";
import { updateNode } from "~/components/collect/store";
import {
  TYPE_INPUT_ELEMENT,
  elementsConfig,
  InputElementData,
} from "@webble/elements";

function InputElement(node: Node<InputElementData, typeof TYPE_INPUT_ELEMENT>) {
  // console.log(node.type + "- ", node.id, " changed");

  return (
    <ElementWrapper
      icon={elementsConfig[TYPE_INPUT_ELEMENT].icon}
      groupId=""
      node={node}
      configEl={
        <Stack gap="sm">
          <TextInput
            label="Placeholder"
            placeholder="Enter field placeholder"
            variant="filled"
            defaultValue={node.data.placeholder}
            onChange={(e) => {
              updateNode<(typeof node)["data"]>(node.id, {
                ...node.data,
                placeholder: e.target.value,
              });
            }}
          />

          <TextInput
            label="Button Label"
            defaultValue={node.data.buttonLabel}
            placeholder="Enter button label"
            variant="filled"
            onChange={(e) =>
              updateNode<(typeof node)["data"]>(node.id, {
                ...node.data,
                buttonLabel: e.target.value,
              })
            }
          />
        </Stack>
      }
    >
      {node.data.placeholder && (
        <Flex gap="sm">
          <Text c={"gray"}>{node.data.placeholder}</Text>
        </Flex>
      )}
    </ElementWrapper>
  );
}

export default InputElement;
