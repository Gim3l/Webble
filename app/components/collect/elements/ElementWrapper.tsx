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
import {
  deleteNode,
  ElementNode,
  graphStore,
  moveNode,
  swapNodePositions,
} from "../store";
import { DragSkeleton, draggableStyle } from "./draggable";
import { ReactNode, memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import classes from "./ElementWrapper.module.css";
import { Icon, IconTrash } from "@tabler/icons-react";
import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { useContextMenu } from "mantine-contextmenu";
import { useSnapshot } from "valtio/react";
import { elementsConfig } from "~/components/collect/elements/config";

function ElementWrapper({
  node,
  children,
  configEl,
  groupId,
  icon,
}: {
  node: ElementNode;
  children: ReactNode;
  configEl?: ReactNode;
  groupId: string;
  icon: Icon;
}) {
  const Icon = icon;

  if (!node) return;

  const { attributes, listeners, setNodeRef, transform, active } = useSortable({
    id: node.id,
    data: {
      type: node.type,
      data: node.data,
      groupId,
    },
    transition: {
      duration: 150, // milliseconds
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  if (active?.id === node.id) {
    return <DragSkeleton />;
  }

  const theme = useMantineTheme();
  const isNew = node.id.startsWith("new");
  const { showContextMenu } = useContextMenu();
  const colorScheme = useMantineColorScheme();

  const { selectedNodes, movingNodeId, currentPopoverId } =
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
        position="left-start"
        withArrow
        arrowSize={20}
        trapFocus
        closeOnClickOutside
        key={node.id}
        opened={isSelected && selectedNodes.length === 1}
        closeOnEscape
        disabled={true}
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
