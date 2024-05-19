import {
  Card,
  Flex,
  ThemeIcon,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { Handle, Node, Position } from "@xyflow/react";

import { TYPE_INPUT_ELEMENT, elementsConfig } from "./config";
import classes from "./ElementWrapper.module.css";
import { graphStore, setSelectedNodes } from "~/components/collect/store";
import { useSnapshot } from "valtio/react";
import { IconFlag } from "@tabler/icons-react";

export type InputElementData = {
  placeholder: string;
  buttonLabel: string;
};

function StartNode(node: Node<InputElementData, typeof TYPE_INPUT_ELEMENT>) {
  const colorScheme = useMantineColorScheme();
  const theme = useMantineTheme();

  const { selectedNodes } = useSnapshot(graphStore);
  const isSelected = !!selectedNodes?.find((n) => n.id === node.id);

  return (
    <>
      <Handle type="source" position={Position.Right} id={node.id} />

      <Card
        p="sm"
        withBorder
        // className="hover:cursor-pointer"
        style={{
          border: isSelected
            ? `1px solid ${theme.colors[theme.primaryColor][7]} `
            : undefined,
        }}
      >
        <Card.Section px="xl" py="xs" className={classes.topSection} w={200}>
          <Flex justify={"space-between"} align={"center"}>
            <Flex align={"center"}>
              <ThemeIcon
                mr={6}
                variant={
                  colorScheme.colorScheme === "dark" ? "light" : "filled"
                }
                radius="sm"
                size="xs"
                color={theme.primaryColor}
              >
                <IconFlag size={16} />
              </ThemeIcon>
              <Flex gap="sm">
                <Text>Start</Text>
              </Flex>
            </Flex>
          </Flex>
        </Card.Section>
      </Card>
    </>
  );
}

export default StartNode;
