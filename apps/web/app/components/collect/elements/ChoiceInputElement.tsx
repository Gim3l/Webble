import { ActionIcon, Box, Flex, FocusTrap, Input } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { updateNode } from "../store";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import ElementWrapper from "./ElementWrapper";
import { TYPE_CHOICE_INPUT_ELEMENT, elementsConfig } from "./config";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { ChoiceInputElementData } from "@webble/elements";

function ChoiceInputElement(
  node: NodeProps<
    Node<ChoiceInputElementData, typeof TYPE_CHOICE_INPUT_ELEMENT>
  >,
) {
  const deleteOption = useCallback(
    (key: string) => {
      if (node.data.options.length === 1) return;
      const items = [...node.data.options.filter((i) => i.id !== key)];
      updateNode<(typeof node)["data"]>(node.id, {
        ...node.data,
        options: items,
      });
    },
    [node.data.options],
  );

  const setOption = useCallback(
    (key: string, data: { label: string }) => {
      const items = [...node.data.options];
      const index = items.findIndex((option) => option.id === key);
      items[index] = { ...items[index], ...data };

      updateNode<(typeof node)["data"]>(node.id, {
        ...node.data,
        options: items,
      });
    },
    [node.data.options],
  );

  const insertAfter = useCallback(
    (key: string) => {
      const items = [...node.data.options];
      const index = items.findIndex((item) => item.id === key);
      items.splice(index + 1, 0, { id: nanoid(), label: "" });

      console.log({ items });
      updateNode<(typeof node)["data"]>(node.id, {
        ...node.data,
        options: items,
      });
    },
    [node.data.options],
  );

  return (
    <ElementWrapper
      key={node.id}
      icon={elementsConfig[TYPE_CHOICE_INPUT_ELEMENT].icon}
      groupId={""}
      node={node}
    >
      <FocusTrap active>
        {node.data.options.map((option) => (
          <div key={option.id}>
            <Box
              style={{ overflow: "visible" }}
              px="sm"
              id={"a"}
              // className={classes.bottomSection}
              pos={"relative"}
              w={200}
            >
              <div className="webble__inner-handle">
                <Handle
                  type="source"
                  position={Position.Right}
                  id={option.id}
                />
              </div>

              <Input
                value={option.label}
                pos={"relative"}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !option?.label) {
                    deleteOption(option.id);
                  }
                }}
                onChange={(e) =>
                  setOption(option.id, { label: e.target.value })
                }
              ></Input>
            </Box>

            <Flex justify={"center"} mb={0} pos={"relative"}>
              <ActionIcon
                onClick={() => insertAfter(option.id)}
                mb={0}
                size={"xs"}
                variant={"light"}
              >
                <IconPlus />
              </ActionIcon>
            </Flex>
          </div>
        ))}
      </FocusTrap>
    </ElementWrapper>
  );
}

export default ChoiceInputElement;
