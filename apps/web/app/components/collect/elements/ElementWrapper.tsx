import {
  Card,
  Flex,
  Popover,
  useMantineTheme,
  ThemeIcon,
  useMantineColorScheme,
  Button,
  Box,
  Text,
} from "@mantine/core";
import { motion } from "framer-motion";
import { deleteNode, graphStore, moveNode, swapNodePositions } from "../store";
import { ReactNode, memo } from "react";
import classes from "./ElementWrapper.module.css";
import { Icon, IconTrash } from "@tabler/icons-react";
import { Handle, NodeProps, NodeToolbar, Position } from "@xyflow/react";
import { useContextMenu } from "mantine-contextmenu";
import { useSnapshot } from "valtio/react";
import { ElementNode, elementsConfig } from "@webble/elements";

function ElementWrapper({
  node,
  children,
  configEl,
  icon,
}: {
  node: NodeProps<ElementNode>;
  children: ReactNode;
  configEl?: ReactNode;
  groupId: string;
  icon: Icon;
}) {
  const Icon = icon;

  if (!node) return;

  const theme = useMantineTheme();
  const { showContextMenu } = useContextMenu();
  const colorScheme = useMantineColorScheme();

  const { selectedNodes, movingNodeId, isDraggingNode } =
    useSnapshot(graphStore);
  const isSelected = !!selectedNodes?.find((n) => n.id === node.id);

  const nodeAnimations = {
    shake: () => ({
      // y: [0, -4, 4, -4, 4, -2, 2, 0],
      y: [0, -5, 0, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        repeat: Infinity,
      },
    }),

    reset: () => ({
      y: 0,
    }),
  };

  return (
    <Box>
      {!!movingNodeId && movingNodeId !== node.id && (
        <NodeToolbar isVisible>
          <Button
            size={"xs"}
            variant={"light"}
            style={{ hover: "cursor: pointer" }}
            onClick={() => {
              movingNodeId && swapNodePositions(movingNodeId, node.id);
              moveNode(null);
            }}
          >
            Move Here
          </Button>
          {/*<button>copy</button>*/}
          {/*<button>expand</button>*/}
        </NodeToolbar>
      )}

      {!!movingNodeId && movingNodeId === node.id && (
        <NodeToolbar isVisible>
          <Button
            size={"xs"}
            variant={"light"}
            style={{ hover: "cursor: pointer" }}
            color={"red"}
            onClick={() => {
              moveNode(null);
            }}
          >
            Cancel Move
          </Button>
        </NodeToolbar>
      )}

      <div id="handles">
        <Handle type="target" position={Position.Left} id={node.id} />
        <Handle type="source" position={Position.Right} id={node.id} />
      </div>

      <Popover
        position="top"
        withArrow
        arrowSize={20}
        key={node.id}
        closeOnClickOutside
        opened={isSelected && selectedNodes.length === 1 && !!configEl}
        closeOnEscape
        // disabled={!!configEl || isDraggingNode}
      >
        <Popover.Target>
          <motion.div
            initial={{
              y: 0,
            }}
            animate={movingNodeId === node.id ? "shake" : "reset"}
            variants={nodeAnimations}
          >
            <Card
              p="sm"
              withBorder
              // className="hover:cursor-pointer
              className={classes.topSection}
              style={{
                border: isSelected
                  ? `1px solid ${theme.colors[theme.primaryColor][7]} `
                  : undefined,
              }}
              onContextMenu={showContextMenu([
                {
                  key: "delete",
                  icon: <IconTrash size={16} />,
                  title: "Delete",
                  onClick: () => deleteNode(node.id),
                },
                {
                  key: "move",
                  icon: <IconTrash size={16} />,
                  title: "Move",
                  onClick: () => {
                    moveNode(node.id);
                    // swapNodePositions(node.id, "el-1");
                  },
                },
              ])}
            >
              <Card.Section px="sm" py="xs" w={200}>
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
                      <Icon size={16} />
                    </ThemeIcon>
                    <Text>{elementsConfig[node.type!]?.name}</Text>
                  </Flex>
                </Flex>
              </Card.Section>

              {children}

              {/*<Card.Section*/}
              {/*  style={{ overflow: "visible" }}*/}
              {/*  px="sm"*/}
              {/*  py="xs"*/}
              {/*  id={"a"}*/}
              {/*  className={classes.bottomSection}*/}
              {/*  w={200}*/}
              {/*>*/}
              {/*  <div className="webble__inner-handle">*/}
              {/*    <Handle type="source" position={Position.Right} id={"a"} />*/}
              {/*  </div>*/}
              {/*  <Input></Input>*/}
              {/*</Card.Section>*/}
            </Card>
          </motion.div>
        </Popover.Target>
        <Popover.Dropdown>{configEl}</Popover.Dropdown>
      </Popover>
    </Box>
  );
}

export default memo(ElementWrapper);
