import {
  Avatar,
  Button,
  Card,
  ColorInput,
  DEFAULT_THEME,
  Flex,
  Modal,
  rem,
  Stack,
  TextInput,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { motion } from "framer-motion";
import classes from "./NewAgentCard.module.css";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { useFetcher } from "@remix-run/react";
import { z } from "zod";

const swatches = [
  ...DEFAULT_THEME.colors.grape,
  ...DEFAULT_THEME.colors.red,
  ...DEFAULT_THEME.colors.green,
  ...DEFAULT_THEME.colors.blue,
];

function NewAgentCard() {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  const fetcher = useFetcher();

  const form = useForm({
    initialValues: {
      name: "",
      color: swatches[Math.floor(Math.random() * swatches.length)],
    },
    validate: zodResolver(
      z.object({
        name: z
          .string()
          .min(2, { message: "Name should have at least 2 letters" }),
        color: z.string().optional(),
      }),
    ),
  });

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create Form" centered>
        <form
          onSubmit={form.onSubmit(({ name, color }) =>
            fetcher.submit(
              { name, color, _action: "create" },
              { method: "POST" },
            ),
          )}
        >
          <TextInput
            label={"Name"}
            mb={"sm"}
            className={"Enter a name for the agent"}
            key={form.key("name")}
            {...form.getInputProps("name")}
          ></TextInput>

          <ColorInput
            closeOnColorSwatchClick
            mb={"sm"}
            label="Choose a color"
            disallowInput
            format="hex"
            withPicker={false}
            key={form.key("color")}
            {...form.getInputProps("color")}
            swatches={swatches}
          />

          <Flex justify={"end"}>
            <Button
              loading={fetcher.state !== "idle"}
              type={"submit"}
              leftSection={
                <IconPlus style={{ width: rem(16), height: rem(16) }} />
              }
            >
              Create
            </Button>
          </Flex>
        </form>
      </Modal>
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 1.02 }}
        transition={{
          mass: 1.3,
          ease: "anticipate",
          duration: "0.2",
        }}
        onClick={() => open()}
      >
        <Card
          withBorder
          className={classes.card}
          style={{
            cursor: "pointer",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          h={"100%"}
        >
          <Stack>
            <Flex justify={"center"} align={"center"}>
              <Avatar radius="md" size={"xl"}>
                <ThemeIcon>
                  <IconPlus />
                </ThemeIcon>
              </Avatar>
            </Flex>
            <Flex justify={"center"}>
              <Title order={3}>New Form</Title>
            </Flex>
          </Stack>
        </Card>
      </motion.div>
    </>
  );
}

export default NewAgentCard;
