import { Flex, Stack, Text, TextInput } from "@mantine/core";
import { Node, NodeProps } from "@xyflow/react";

import ElementWrapper from "./ElementWrapper";
import { updateNode } from "~/components/collect/store";
import {
  elementsConfig,
  TextBubbleElementData,
  TYPE_TEXT_BUBBLE_ELEMENT,
} from "@webble/elements";

function TextBubbleElement(
  node: NodeProps<Node<TextBubbleElementData, typeof TYPE_TEXT_BUBBLE_ELEMENT>>,
) {
  return (
    <ElementWrapper
      icon={elementsConfig[node.type].icon}
      groupId=""
      node={node}
      configEl={
        <Stack gap="sm">
          <TextInput
            label="Text"
            placeholder="Enter field placeholder"
            variant="filled"
            defaultValue={node.data.text}
            onChange={(e) => {
              updateNode<(typeof node)["data"]>(node.id, {
                ...node.data,
                text: e.target.value,
              });
            }}
          />
        </Stack>
      }
    >
      {node.data.text && (
        <Flex gap="sm">
          <Text c={"gray"}>{node.data.text}</Text>
        </Flex>
      )}
    </ElementWrapper>
  );
}

export default TextBubbleElement;
