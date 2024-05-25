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
  Badge,
} from "@mantine/core";
import { motion } from "framer-motion";
import { graphStore, updateGroupElement } from "../store";
import React, { ReactNode, useMemo } from "react";
import { Icon, IconVariable } from "@tabler/icons-react";
import { useContextMenu } from "mantine-contextmenu";
import { useSnapshot } from "valtio/react";
import {
  BaseInputElementData,
  elementsConfig,
  GroupElement,
  isFromInputsGroup,
} from "@webble/elements";
import { useDisclosure } from "@mantine/hooks";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/build.$formId";

function ElementWrapper({
  element,
  children,
  configEl,
  icon,
}: {
  element: GroupElement;
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
      <Drawer
        opened={opened}
        position={"right"}
        size={"xs"}
        onClose={() => {
          close();
          console.log("yoo");
        }}
        overlayProps={{ backgroundOpacity: 0 }}
        // withOverlay={false}
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
            <Text>{elementsConfig[element.type!]?.name}</Text>
          </Flex>
        }
      >
        {configEl}

        {isFromInputsGroup(element) && <SaveToVariable element={element} />}
      </Drawer>

      <motion.div
        initial={{
          y: 0,
        }}
        animate={movingNodeId === element.id ? "shake" : "reset"}
        variants={nodeAnimations}
        onClick={() => open()}
      >
        <Flex justify={"space-between"} align={"center"}>
          <Flex align={"center"} px={"sm"}>
            <ThemeIcon
              mr={6}
              variant={colorScheme.colorScheme === "dark" ? "light" : "filled"}
              radius="sm"
              size="xs"
              color={theme.primaryColor}
            >
              <Icon size={16} />
            </ThemeIcon>
            <Text>{elementsConfig[element.type!]?.name}</Text>
          </Flex>

          {isFromInputsGroup(element) && element.data.variable && (
            <Badge
              size={"xs"}
              leftSection={
                <IconVariable style={{ width: rem(12), height: rem(12) }} />
              }
            >
              {element.data.variable}
            </Badge>
          )}
        </Flex>
        {children && (
          <Box mt={"xs"} px={"sm"}>
            {children}
          </Box>
        )}
      </motion.div>
    </div>
  );
}

function SaveToVariable({ element }: { element: GroupElement<"text_input"> }) {
  const { form } = useLoaderData<typeof loader>();
  return (
    <Select
      data={form?.variables.map((i) => i.label)}
      defaultValue={(element.data as BaseInputElementData)?.variable}
      mt={"xl"}
      onChange={(v) => {
        updateGroupElement({
          ...element,
          data: { ...element.data, variable: v || "" },
        });
      }}
      label={"Assign to Variable"}
      size={"xs"}
    ></Select>
  );
}

export default ElementWrapper;
