import { Link, useFetcher } from "@remix-run/react";
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Text,
  Flex,
  Group,
  Menu,
  Modal,
  rem,
  Stack,
  Title,
} from "@mantine/core";
import { IconCopy, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { Form } from "dbschema/interfaces";
import { motion } from "framer-motion";
import classes from "./AgentCard.module.css";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

const AgentCard = ({ form }: { form: Partial<Form> }) => {
  const [opened, { close, open }] = useDisclosure();
  const deleteAgentFetcher = useFetcher();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={<Title order={6}>Delete Agent ({form.name})</Title>}
        centered
      >
        <Text fw={800}>Are you sure you want to delete this agent?</Text> All
        related resources will be deleted as well.
        <Group mt="xl" justify={"end"}>
          <Button variant={"light"} onClick={close}>
            No
          </Button>
          <deleteAgentFetcher.Form method={"POST"}>
            <input name={"formId"} hidden value={form.id} readOnly />
            <Button
              color={"red"}
              leftSection={
                <IconTrash style={{ width: rem(14), height: rem(14) }} />
              }
              type={"submit"}
              name={"_action"}
              value={"delete"}
            >
              Delete Agent
            </Button>
          </deleteAgentFetcher.Form>
        </Group>
      </Modal>

      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 1.02 }}
        transition={{
          mass: 2,
          ease: "anticipate",
          duration: "0.2",
        }}
      >
        <Card
          key={form.id}
          component={Link}
          to={`/build/${form.id}`}
          withBorder
          classNames={{ root: classes.root }}
        >
          <Stack>
            <Flex
              justify={"end"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              // pos={"absolute"}
              // right={10}
              // style={{ position: "absolute" }}
            >
              <Menu width={200} shadow="md">
                <Menu.Target>
                  <ActionIcon variant={"light"}>
                    <IconDotsVertical size={18} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={
                      <IconCopy style={{ width: rem(14), height: rem(14) }} />
                    }
                    component="a"
                    href="https://mantine.dev"
                  >
                    Duplicate
                  </Menu.Item>

                  <Menu.Item
                    leftSection={
                      <IconTrash style={{ width: rem(14), height: rem(14) }} />
                    }
                    component="a"
                    href="https://mantine.dev"
                    target="_blank"
                    onClick={open}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
            <Flex justify={"center"} align={"center"}>
              <Avatar radius="md" size={"xl"}>
                A
              </Avatar>
            </Flex>
            <Flex justify={"center"}>
              <Title order={3}>{form.name}</Title>
            </Flex>
          </Stack>
        </Card>
      </motion.div>
    </>
  );
};

export default AgentCard;
