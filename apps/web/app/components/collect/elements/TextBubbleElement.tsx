import { TextInput } from "@mantine/core";
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
    >
      <TextInput
        placeholder="Enter message"
        variant="filled"
        className="nodrag"
        defaultValue={node.data.text}
        size={"xs"}
        onChange={(e) => {
          updateNode<(typeof node)["data"]>(node.id, {
            ...node.data,
            text: e.target.value,
          });
        }}
      />
    </ElementWrapper>
  );
}

export default TextBubbleElement;
