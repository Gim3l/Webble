import { Flex, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { IconHash } from "@tabler/icons-react";
import ElementWrapper from "./ElementWrapper";
import { TYPE_NUMBER_INPUT_ELEMENT } from "./config";
import { Node } from "@xyflow/react";
import { updateNode } from "~/components/collect/store";

export type NumberInputElementData = {
  placeholder: string;
  buttonLabel: string;
  min?: number;
  max?: number;
  step?: number;
};

function NumberInputElement(
  node: Node<NumberInputElementData, typeof TYPE_NUMBER_INPUT_ELEMENT>
) {
  return (
    <ElementWrapper
      groupId=""
      node={node}
      icon={IconHash}
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
