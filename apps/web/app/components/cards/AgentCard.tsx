import { Link } from "@remix-run/react";
import {
  ActionIcon,
  Avatar,
  Card,
  Flex,
  Menu,
  rem,
  Stack,
  Title,
} from "@mantine/core";
import { IconCopy, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { Form } from "dbschema/interfaces";
import { motion } from "framer-motion";
import classes from "./AgentCard.module.css";

const AgentCard = ({ form }: { form: Partial<Form> }) => {
  return (
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
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
          <Flex justify={"center"} align={"center"}>
            <Avatar color="cyan" radius="md" size={"xl"}>
              A
            </Avatar>
          </Flex>
          <Flex justify={"center"}>
            <Title order={3}>{form.name}</Title>
          </Flex>
        </Stack>
      </Card>
    </motion.div>
  );
};

export default AgentCard;
