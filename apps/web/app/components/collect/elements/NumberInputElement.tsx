import { Flex, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import ElementWrapper from "./ElementWrapper";
import { Node, NodeProps } from "@xyflow/react";
import { updateNode } from "~/components/collect/store";
import {
  NumberInputElementData,
  TYPE_NUMBER_INPUT_ELEMENT,
  elementsConfig,
} from "@webble/elements";

function NumberInputElement(
  node: NodeProps<
    Node<NumberInputElementData, typeof TYPE_NUMBER_INPUT_ELEMENT>
  >,
) {
  return (
    <ElementWrapper
      groupId=""
      node={node}
      icon={elementsConfig[TYPE_NUMBER_INPUT_ELEMENT].icon}
      configEl={
        <Stack gap="sm">
          <TextInput
            label="Placeholder"
            placeholder="Enter field placeholder"
            variant="filled"
            defaultValue={node.data.placeholder}
            onChange={(e) =>
              updateNode<(typeof node)["data"]>(node.id, {
                ...node.data,
                placeholder: e.target.value,
              })
            }
          />

          <TextInput
            label="Button Label"
            defaultValue={node.data.buttonLabel}
            placeholder="Enter field placeholder"
            variant="filled"
            onChange={(e) =>
              updateNode<(typeof node)["data"]>(node.id, {
                ...node.data,
                buttonLabel: e.target.value,
              })
            }
          />

          <NumberInput
            label="Min"
            defaultValue={node.data.min}
            placeholder="Enter minimum value"
            variant="filled"
            stepHoldDelay={500}
            stepHoldInterval={100}
            onChange={(v) =>
              updateNode<(typeof node)["data"]>(node.id, {
                ...node.data,
                min: Number(v),
              })
            }
          />

          <NumberInput
            label="Max"
            defaultValue={node.data.max}
            placeholder="Enter maximum value"
            variant="filled"
            stepHoldDelay={500}
            stepHoldInterval={100}
            onChange={(v) =>
              updateNode<(typeof node)["data"]>(node.id, {
                ...node.data,
                max: Number(v),
              })
            }
          />

          <NumberInput
            label="Step"
            defaultValue={node.data.step}
            placeholder="Step count"
            variant="filled"
            stepHoldDelay={500}
            stepHoldInterval={100}
            onChange={(v) =>
              updateNode<(typeof node)["data"]>(node.id, {
                ...node.data,
                step: Number(v),
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

export default NumberInputElement;
