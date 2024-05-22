import {
  Card,
  Flex,
  ThemeIcon,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { Handle, Node, Position, useOnSelectionChange } from "@xyflow/react";

import { TYPE_INPUT_ELEMENT } from "./config";
import classes from "./ElementWrapper.module.css";
import { IconFlag } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useSnapshot } from "valtio/react";
import { graphStore } from "~/components/collect/store";

export type InputElementData = {
  placeholder: string;
  buttonLabel: string;
};

function StartNode(node: Node<InputElementData, typeof TYPE_INPUT_ELEMENT>) {
  const colorScheme = useMantineColorScheme();
  const theme = useMantineTheme();

  console.log("node debug, ", node.id);

  return (
    <>
      <Handle type="source" position={Position.Right} id={node.id} />

      <Card
        p="sm"
        withBorder
        // className="hover:cursor-pointer"
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
