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
  Portal,
  Drawer,
  Dialog,
  Modal,
  ActionIcon,
  Tooltip,
  Select,
  rem,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
  deleteNode,
  graphStore,
  moveNode,
  swapNodePositions,
  updateNode,
} from "../store";
import React, { ReactNode, memo, useCallback, useMemo } from "react";
import classes from "./ElementWrapper.module.css";
import {
  Icon,
  IconArrowsMoveHorizontal,
  IconAutomaticGearbox,
  IconEdit,
  IconForms,
  IconManualGearbox,
  IconSettings2,
  IconSettingsCog,
  IconTrash,
} from "@tabler/icons-react";
import { Handle, NodeProps, NodeToolbar, Position } from "@xyflow/react";
import { useContextMenu } from "mantine-contextmenu";
import { useSnapshot } from "valtio/react";
import {
  BaseInputElementData,
  ElementNode,
  elementsConfig,
} from "@webble/elements";
import { useDisclosure, useHover } from "@mantine/hooks";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/build.$formId";

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
  const [opened, { open, close }] = useDisclosure();
  const Icon = icon;

  const theme = useMantineTheme();
  const { showContextMenu } = useContextMenu();
  const colorScheme = useMantineColorScheme();

  const { movingNodeId } = useSnapshot(graphStore);
  const nodeAnimations = useMemo(
    () => ({
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
    }),
    [],
  );

  return (
    <div>
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

      <Drawer
        opened={opened}
        position={"left"}
        size={"xs"}
        onClose={() => {
          close();
          console.log("yoo");
        }}
        overlayProps={{ backgroundOpacity: 0 }}
        title={
          <Flex align={"center"}>
            <ThemeIcon
              mr={6}
              variant={colorScheme.colorScheme === "dark" ? "light" : "filled"}
              radius="sm"
              size="xs"
              color={theme.primaryColor}
            >
              <Icon size={16} />
            </ThemeIcon>
            <Text>{elementsConfig[node.type!]?.name}</Text>
          </Flex>
        }
      >
        {configEl}

        <SaveToVariable node={node} />
      </Drawer>

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
          // style={{
          //   border: false
          //     ? `1px solid ${theme.colors[theme.primaryColor][7]} `
          //     : undefined,
          // }}
          onContextMenu={showContextMenu([
            {
              key: "delete",
              icon: <IconTrash size={16} />,
              title: "Delete",
              onClick: () => deleteNode(node.id),
            },
            {
              key: "move",
              icon: <IconArrowsMoveHorizontal size={16} />,
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
              {configEl && (
                <Tooltip label={"Settings"}>
                  <ActionIcon
                    size={"xs"}
                    variant={"light"}
                    style={{ hover: "cursor: pointer" }}
                    onClick={() => open()}
                  >
                    <IconSettingsCog />
                  </ActionIcon>
                </Tooltip>
              )}
            </Flex>
          </Card.Section>
          {children && <Box mt={"xs"}>{children}</Box>}

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
      {/*</Popover.Target>*/}
      {/*<Popover.Dropdown>{configEl}</Popover.Dropdown>*/}
      {/*</Popover>*/}
    </div>
  );
}

function SaveToVariable({ node }: { node: NodeProps<ElementNode> }) {
  const { form } = useLoaderData<typeof loader>();
  return (
    <Select
      data={form?.variables.map((i) => i.label)}
      defaultValue={(node.data as BaseInputElementData)?.variable}
      mt={"xl"}
      onChange={(v) => {
        updateNode<(typeof node)["data"]>(node.id, {
          ...node.data,
          variable: v || "",
        });
      }}
      label={"Assign to Variable"}
      size={"xs"}
    ></Select>
  );
}

export default ElementWrapper;
