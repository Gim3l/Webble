import {
  Autocomplete,
  Card,
  ComboboxData,
  ComboboxItem,
  ComboboxItemGroup,
  FocusTrap,
  Group,
  Select,
  SelectProps,
  ThemeIcon,
} from "@mantine/core";
import { Handle, NodeProps, Position, Node } from "@xyflow/react";
import { createElementNode, NewNodeData } from "./store";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import { ElementTypes, elementsConfig } from "./elements/config";

export function NewElementNode(node: NodeProps<Node<NewNodeData, "new">>) {
  const data = useMemo(() => {
    const data: ComboboxItemGroup[] = [];

    for (const key of Object.keys(elementsConfig)) {
      const config = elementsConfig[key as ElementTypes];
      const item: ComboboxItem = {
        label: config.name,
        value: key,
        disabled: false,
      };
      const group = data.find(
        (i) => i.group === elementsConfig[key as ElementTypes].group
      );

      if (group) {
        group.items.push(item);
        continue;
      }
      data.push({
        group: config.group,
        items: [item],
      });
    }

    return data;
  }, []);

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const IconEl = elementsConfig[option.value as ElementTypes].icon;

    return (
      <Group flex="1" gap="xs" wrap="nowrap">
        <ThemeIcon size="xs" radius="sm">
          <IconEl size={16} />
        </ThemeIcon>
        {option.label}
      </Group>
    );
  };

  return (
    <>
      <Handle type="target" position={Position.Left} id={node.id} />
      <Card p="sm" withBorder className="hover:cursor-pointer">
        <Card.Section pl="lg" pr="sm" py="xs" w={240}>
          {/* <Handle type="source" position={Position.Right} id={node.id} /> */}
          <FocusTrap>
            <Select
              // label="Pick a type"
              placeholder="Pick an element"
              variant="default"
              onChange={(v) => {
                createElementNode(
                  {
                    type: v as ElementTypes,
                    data: elementsConfig[v as ElementTypes].default,
                    id: nanoid(),
                    selectable: true,
                    position: {
                      x: node.positionAbsoluteX,
                      y: node.positionAbsoluteY,
                    },
                  },
                  node.id
                );
              }}
              searchable
              autoFocus
              data={data}
              renderOption={renderSelectOption}
            />
          </FocusTrap>
        </Card.Section>
      </Card>
    </>
  );
}
