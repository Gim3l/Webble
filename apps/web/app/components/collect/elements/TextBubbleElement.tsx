import { Text } from "@mantine/core";
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
      element={node}
    >
      {JSON.stringify(node.data)}
      {node.data.text && <Text c={"gray"}>{node.data.text}</Text>}
    </ElementWrapper>
  );
}

export default TextBubbleElement;
