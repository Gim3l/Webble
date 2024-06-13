import { Box, Button, Group, Input, Paper, rem, Stack } from "@mantine/core";
import { IconQuestionMark } from "@tabler/icons-react";
import { updateGroupElement } from "../store";
import ElementWrapper from "./ElementWrapper";
import { TYPE_CHOICE_INPUT_ELEMENT, elementsConfig } from "./config";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { ChoiceInputGroupElement } from "@webble/elements";
import { ElementHandles } from "~/components/collect/GroupNode";

function ChoiceInputElement(element: ChoiceInputGroupElement) {
  const deleteOption = useCallback(
    (key: string) => {
      if (element.data.options.length === 1) return;
      const items = [...element.data.options.filter((i) => i.id !== key)];

      updateGroupElement<ChoiceInputGroupElement>({
        ...element,
        data: {
          ...element.data,
          options: items,
        },
      });
    },
    [element.data.options],
  );

  const setOption = useCallback(
    (key: string, data: { label: string }) => {
      const items = [...element.data.options];
      const index = items.findIndex((option) => option.id === key);
      items[index] = { ...items[index], ...data };

      updateGroupElement<ChoiceInputGroupElement>({
        ...element,
        data: {
          ...element.data,
          options: items,
        },
      });
    },
    [element.data.options],
  );

  const insertAfter = useCallback(
    (key: string) => {
      const items = [...element.data.options];
      const index = items.findIndex((item) => item.id === key);
      items.splice(index + 1, 0, { id: nanoid(), label: "" });

      updateGroupElement<ChoiceInputGroupElement>({
        ...element,
        data: {
          ...element.data,
          options: items,
        },
      });
    },
    [element.data.options],
  );

  return (
    <ElementWrapper
      key={element.id}
      icon={elementsConfig[TYPE_CHOICE_INPUT_ELEMENT].icon}
      groupId={""}
      element={element}
      configEl={
        <>
          <Stack
            px="sm"
            // className={classes.bottomSection}
            pos={"relative"}
          >
            {element.data.options.map((option) => (
              <Input
                key={option.id}
                defaultValue={option.label}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !option?.label) {
                    deleteOption(option.id);
                  }
                }}
                onChange={(e) =>
                  setOption(option.id, { label: e.target.value })
                }
              ></Input>
            ))}
          </Stack>
          <Group justify={"end"}>
            <Button
              size={"xs"}
              mt={"sm"}
              onClick={() => {
                insertAfter(
                  element.data.options[element.data.options.length - 1].id,
                );
              }}
            >
              Add Choice
            </Button>
          </Group>
        </>
      }
    >
      <Stack gap={"xs"}>
        {element.data.options.map((option) => (
          <Box pos={"relative"} key={option.id}>
            <ElementHandles targetId={option.id} sourceId={option.id} />
            <Paper withBorder p={"xs"} py={2}>
              {option.label || (
                <Group>
                  <IconQuestionMark
                    style={{ width: rem(16), height: rem(16) }}
                  />
                  <IconQuestionMark
                    style={{ width: rem(16), height: rem(16) }}
                  />
                  <IconQuestionMark
                    style={{ width: rem(16), height: rem(16) }}
                  />
                </Group>
              )}
            </Paper>
          </Box>
        ))}
      </Stack>
    </ElementWrapper>
  );
}

export default ChoiceInputElement;
