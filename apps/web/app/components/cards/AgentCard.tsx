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
  TextInput,
  ColorInput,
  DEFAULT_THEME,
  useMantineTheme,
  Badge,
  Center,
  Box,
  Box,
} from "@mantine/core";
import {
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { Form } from "dbschema/interfaces";
import { motion } from "framer-motion";
import classes from "./AgentCard.module.css";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { notifications } from "@mantine/notifications";

const AgentCard = ({ form }: { form: Partial<Form> }) => {
  const [opened, { close, open }] = useDisclosure();
  const [editOpened, { close: closeEditDialog, open: openEditDialog }] =
    useDisclosure();
  const deleteAgentFetcher = useFetcher();

  const theme = useMantineTheme();
  const fetcher = useFetcher<{ success: boolean }>();

  const formInit = useForm({
    initialValues: { name: form?.name || "", color: form?.color || "" },
    validate: zodResolver(
      z.object({
        name: z
          .string()
          .min(2, { message: "Name should have at least 2 letters" }),
        color: z.string().optional(),
      }),
    ),
  });

  useEffect(() => {
    if (fetcher.data?.success) {
      closeEditDialog();
      notifications.show({
        title: "Form Updated",
        message: "Your form was updated successfully.",
      });
    }
  }, [fetcher.data]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={<Title order={6}>Delete Form ({form.name})</Title>}
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

      <Modal
        opened={editOpened}
        onClose={closeEditDialog}
        title={<Modal.Title>Edit Form ({form.name})</Modal.Title>}
        centered
      >
        <form
          onSubmit={formInit.onSubmit(({ name, color }) =>
            fetcher.submit(
              { name, color, id: form.id, _action: "update" },
              { method: "POST" },
            ),
          )}
        >
          <TextInput
            label={"Name"}
            mb={"sm"}
            className={"Enter a name for the agent"}
            key={formInit.key("name")}
            {...formInit.getInputProps("name")}
          ></TextInput>

          <ColorInput
            mb={"sm"}
            closeOnColorSwatchClick
            label="Choose a color"
            disallowInput
            format="hex"
            withPicker={false}
            defaultValue={theme.colors[theme.primaryColor][5]}
            key={formInit.key("color")}
            {...formInit.getInputProps("color")}
            swatches={[
              ...DEFAULT_THEME.colors.grape,
              ...DEFAULT_THEME.colors.red,
              ...DEFAULT_THEME.colors.green,
              ...DEFAULT_THEME.colors.blue,
            ]}
          />

          <Flex justify={"end"}>
            <Button
              loading={fetcher.state !== "idle"}
              type={"submit"}
              leftSection={
                <IconEdit style={{ width: rem(16), height: rem(16) }} />
              }
            >
              Update
            </Button>
          </Flex>
        </form>
      </Modal>

      <Card key={form.id} withBorder classNames={{ root: classes.root }}>
        <Box>
          <Flex gap={"sm"} align={"start"} justify={"end"} mb={"sm"}>
            <Flex justify={"end"}>
              {form.published ? (
                <Badge variant={"light"} size={"sm"}>
                  Public
                </Badge>
              ) : (
                <Badge variant={"light"} size={"sm"}>
                  Private
                </Badge>
              )}
            </Flex>
          </Flex>

          <Flex mt={"sm"} align={"center"} gap={"sm"}>
            <Avatar radius="md" color={form?.color} size={"lg"}>
              {form.name?.[0]}
            </Avatar>
            <Title order={5}>{form.name}</Title>
          </Flex>
        </Box>

        <Flex
          mt={"lg"}
          justify={"end"}
          align={"end"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          gap={"sm"}
          style={{ flexGrow: 1 }}
        >
          <Flex
            align={"center"}
            w={"100%"}
            gap={"xs"}
            justify={"space-between"}
          >
            <Menu width={200} shadow="md">
              <Menu.Target>
                <ActionIcon variant={"light"}>
                  <IconDotsVertical size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  onClick={openEditDialog}
                  leftSection={
                    <IconCopy style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Edit
                </Menu.Item>

                <Menu.Item
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={open}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Button component={Link} to={`/build/${form.id}`} fullWidth>
              Open
            </Button>
          </Flex>
        </Flex>
      </Card>
    </>
  );
};

export default AgentCard;
