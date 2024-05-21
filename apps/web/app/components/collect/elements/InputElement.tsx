import { Flex, Stack, Text, TextInput } from "@mantine/core";
import { Node, NodeProps } from "@xyflow/react";

import ElementWrapper from "./ElementWrapper";
import { updateNode } from "~/components/collect/store";
import {
  TYPE_INPUT_ELEMENT,
  elementsConfig,
  InputElementData,
} from "@webble/elements";

function InputElement(
  node: NodeProps<Node<InputElementData, typeof TYPE_INPUT_ELEMENT>>,
) {
  // console.log(node.type + "- ", node.id, " changed");

  return (
    <ElementWrapper
      icon={elementsConfig[node.type].icon}
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
      <TextInput
        placeholder="Enter field placeholder"
        variant={"filled"}
        className="nodrag"
        size={"xs"}
        defaultValue={node.data.placeholder}
        onChange={(e) => {
          updateNode<(typeof node)["data"]>(node.id, {
            ...node.data,
            placeholder: e.target.value,
          });
        }}
      />
    </ElementWrapper>
  );
}

export default InputElement;
