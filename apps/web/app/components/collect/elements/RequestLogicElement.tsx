import {
  Stack,
  Textarea,
  Text,
  TextInput,
  FocusTrap,
  Select,
  Fieldset,
  Accordion,
  ThemeIcon,
  useMantineTheme,
  Group,
  Flex,
  Button,
  rem,
  ScrollArea,
  ActionIcon,
  Input,
  JsonInput,
  Switch,
} from "@mantine/core";
import ElementWrapper from "./ElementWrapper";

import {
  elementsConfig,
  GroupElement,
  RequestLogicElementData,
  RequestLogicGroupElement,
} from "@webble/elements";
import { updateGroupElement } from "~/components/collect/store";
import VariableInput from "~/components/VariableInput";
import {
  IconAdjustmentsQuestion,
  IconBraces,
  IconBrackets,
  IconCheck,
  IconCode,
  IconCurlyLoop,
  IconJson,
  IconListSearch,
  IconPlus,
  IconSearch,
  IconStackFront,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedCallback, useMap } from "@mantine/hooks";
import { nanoid } from "nanoid";

function RequestLogicElement(element: RequestLogicGroupElement) {
  const theme = useMantineTheme();

  const debouncedUpdateGroupElement = useDebouncedCallback(
    (element: RequestLogicGroupElement) => {
      updateGroupElement(element);
    },
    500,
  );

  return (
    <ElementWrapper
      icon={elementsConfig[element.type].icon}
      groupId=""
      element={element}
      configEl={
        <FocusTrap>
          <Stack gap="sm">
            <TextInput
              label="Name"
              placeholder="Enter request name (e.g. GetTodos)"
              variant="filled"
              defaultValue={element.data.name}
              onChange={(e) => {
                debouncedUpdateGroupElement({
                  ...element,
                  data: { ...element.data, name: e.currentTarget.value },
                });
              }}
            />
            <Fieldset legend={"Basic Configuration"}>
              <Stack gap={"xs"}>
                <Select
                  defaultValue={element.data.request.method || "GET"}
                  allowDeselect={false}
                  label={"Method"}
                  variant={"filled"}
                  onChange={(value) => {
                    debouncedUpdateGroupElement({
                      ...element,
                      data: {
                        ...element.data,
                        request: {
                          ...element.data.request,
                          method:
                            (value as RequestLogicElementData["request"]["method"]) ||
                            "GET",
                        },
                      },
                    });
                  }}
                  data={[
                    "GET",
                    "POST",
                    "PATCH",
                    "PUT",
                    "DELETE",
                    "HEAD",
                    "OPTIONS",
                    "TRACE",
                    "CONNECT",
                  ]}
                />

                {/*TODO: Add url validation*/}
                <VariableInput
                  label={"URL"}
                  variant={"filled"}
                  defaultValue={element.data.request.url}
                  onOptionSubmit={(value) => {
                    debouncedUpdateGroupElement({
                      ...element,
                      data: {
                        ...element.data,
                        request: {
                          ...element.data.request,
                          url: value,
                        },
                      },
                    });
                  }}
                  onChange={(e) => {
                    debouncedUpdateGroupElement({
                      ...element,
                      data: {
                        ...element.data,
                        request: {
                          ...element.data.request,
                          url: e.currentTarget.value,
                        },
                      },
                    });
                  }}
                ></VariableInput>

                <Group justify={"end"}>
                  <Switch
                    defaultChecked={element.data.runOnClient}
                    labelPosition="left"
                    onChange={(e) => {
                      updateGroupElement({
                        ...element,
                        data: {
                          ...element.data,
                          runOnClient: e.currentTarget.checked,
                        },
                      });
                    }}
                    thumbIcon={
                      element.data.runOnClient ? (
                        <IconCheck
                          style={{ width: rem(12), height: rem(12) }}
                          color={theme.colors.teal[6]}
                          stroke={3}
                        />
                      ) : (
                        <IconX
                          style={{ width: rem(12), height: rem(12) }}
                          color={theme.colors.red[6]}
                          stroke={3}
                        />
                      )
                    }
                    label="Run request on the client?"
                  />
                </Group>
              </Stack>
            </Fieldset>

            <Fieldset legend={"Advanced Configuration"}>
              <Accordion variant={"contained"}>
                <Accordion.Item value={"queryParams"}>
                  <Accordion.Control
                    icon={
                      <ThemeIcon
                        variant={"light"}
                        color={theme.primaryColor}
                        size={"xs"}
                      >
                        <IconAdjustmentsQuestion />
                      </ThemeIcon>
                    }
                  >
                    Query Params
                  </Accordion.Control>
                  <Accordion.Panel>
                    <MappingsField
                      defaultValues={element.data.request.queryParams || {}}
                      onValueChange={(value) => {
                        debouncedUpdateGroupElement({
                          ...element,
                          data: {
                            ...element.data,
                            request: {
                              ...element.data.request,
                              queryParams: value,
                            },
                          },
                        });
                      }}
                    />
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value={"body"}>
                  <Accordion.Control
                    icon={
                      <ThemeIcon
                        variant={"light"}
                        color={theme.primaryColor}
                        size={"xs"}
                      >
                        <IconBraces />
                      </ThemeIcon>
                    }
                  >
                    Body
                  </Accordion.Control>
                  <Accordion.Panel>
                    <JsonInput
                      label={"Body (JSON)"}
                      formatOnBlur
                      variant={"filled"}
                      minRows={8}
                      maxRows={10}
                      defaultValue={element.data.request.body}
                      onChange={(value) => {
                        debouncedUpdateGroupElement({
                          ...element,
                          data: {
                            ...element.data,
                            request: {
                              ...element.data.request,
                              body: value,
                            },
                          },
                        });
                      }}
                      autosize
                    />
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value={"headers"}>
                  <Accordion.Control
                    icon={
                      <ThemeIcon
                        variant={"light"}
                        color={theme.primaryColor}
                        size={"xs"}
                      >
                        <IconStackFront />
                      </ThemeIcon>
                    }
                  >
                    Headers
                  </Accordion.Control>
                  <Accordion.Panel>
                    <MappingsField
                      defaultValues={element.data.request.headers || {}}
                      onValueChange={(value) => {
                        debouncedUpdateGroupElement({
                          ...element,
                          data: {
                            ...element.data,
                            request: {
                              ...element.data.request,
                              headers: value,
                            },
                          },
                        });
                      }}
                    />
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Fieldset>
          </Stack>
        </FocusTrap>
      }
    >
      <Text c={"gray"}>{element.data.name}</Text>
    </ElementWrapper>
  );
}

function MappingsField({
  defaultValues,
  onValueChange,
}: {
  defaultValues: Record<string, string>;
  onValueChange: (value: Record<string, string>) => void;
}) {
  const map = useMap(
    Object.entries(defaultValues).map(([key, value]) => [
      nanoid(),
      { key, value },
    ]),
  );

  // function convertToObject(map: Map<string, { key: string; value: string }>) {
  //   return Object.keys(Object.fromEntries(map.entries())).map((key) => {
  //     const item = map.get(key);
  //     if (!item) return;
  //     return {
  //       [item.key]: item.value,
  //     };
  //   });
  // }

  function convertToObject(map: Map<string, { key: string; value: string }>) {
    return Object.assign(
      {},
      ...Object.keys(Object.fromEntries(map.entries())).map((key) => {
        const item = map.get(key);
        if (!item) return; // Handle missing keys
        return {
          [item.key]: item.value,
        };
      }),
    );
  }

  return (
    <ScrollArea h={200} offsetScrollbars>
      {Array.from(map.entries()).map(([key, value]) => (
        <Flex key={key} gap={"xs"} align={"end"}>
          <VariableInput
            variant={"filled"}
            label={"Key"}
            value={value.key}
            onChange={(e) => {
              map.set(key, {
                key: e.currentTarget.value,
                value: value.value,
              });
              onValueChange(convertToObject(map));
            }}
            onOptionSubmit={(val) => {
              map.set(key, {
                key: val,
                value: value.value,
              });
              onValueChange(convertToObject(map));
            }}
            size={"xs"}
          ></VariableInput>
          <VariableInput
            variant={"filled"}
            label={"Value"}
            size={"xs"}
            value={value.value}
            onChange={(e) => {
              map.set(key, {
                key: value.key,
                value: e.currentTarget.value,
              });
              onValueChange(convertToObject(map));
            }}
            onOptionSubmit={(val) => {
              map.set(key, {
                key: value.key,
                value: val,
              });

              onValueChange(convertToObject(map));
            }}
          ></VariableInput>

          <ActionIcon
            size={"xs"}
            mb={4}
            color={"red"}
            variant={"light"}
            onClick={() => {
              map.delete(key);
              onValueChange(convertToObject(map));
            }}
          >
            <IconTrash />
          </ActionIcon>
        </Flex>
      ))}
      <Flex justify={"end"} mt={"xs"}>
        <Button
          size={"xs"}
          leftSection={<IconPlus size={14} />}
          onClick={() => {
            map.set(nanoid(), { value: "", key: "" });
          }}
        >
          Add
        </Button>
      </Flex>
    </ScrollArea>
  );
}

export default RequestLogicElement;
