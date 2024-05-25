import {
  BaseEdge,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import {
  ActionIcon,
  Box,
  Button,
  Chip,
  Drawer,
  Group,
  rem,
  Select,
  SimpleGrid,
  Table,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import {
  IconTrash,
  IconVariable,
  IconVariableOff,
  IconVariablePlus,
} from "@tabler/icons-react";
import { EdgeData, elementsConfig } from "@webble/elements";
import { useDisclosure, useMap } from "@mantine/hooks";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/build.$formId";
import React, { useState } from "react";
import {
  addEdgeCondition,
  removeEdgeCondition,
} from "~/components/collect/store";
import { nanoid } from "nanoid";

export default function DefaultEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: EdgeProps<Edge<EdgeData>>) {
  // const { setEdges } = useReactFlow();
  const [opened, { close, open }] = useDisclosure();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { form } = useLoaderData<typeof loader>();
  const condition = useMap([
    ["variable", ""],
    ["value", ""],
    ["condition", "="],
  ]);

  return (
    <>
      <Drawer
        opened={opened}
        position={"left"}
        size={"md"}
        onClose={() => {
          close();
        }}
        overlayProps={{ backgroundOpacity: 0 }}
        title="Edge Conditons"
      >
        <Box py={"sm"}>
          <SimpleGrid cols={3}>
            <Select
              data={form?.variables.map((i) => i.label)}
              value={condition.get("variable")}
              onChange={(v) => condition.set("variable", v) || ""}
              label={"Variable"}
              size={"xs"}
            ></Select>
            <Select
              value={condition.get("condition")}
              onChange={(v) => condition.set("condition", v) || ""}
              data={["=", "!="]}
              label={"Condition"}
              size={"xs"}
            ></Select>
            <TextInput
              value={condition.get("value")}
              onChange={(e) => condition.set("value", e.target.value) || ""}
              size={"xs"}
              label={"Value"}
            ></TextInput>
          </SimpleGrid>
          <Group justify={"end"} mt={"sm"}>
            <Button
              onClick={() => {
                const variable = condition.get("variable");
                const cond = condition.get(
                  "condition",
                ) as EdgeData["conditions"][0]["cond"];
                const value = condition.get("value");
                console.log({ variable, cond, value });
                if (variable && cond && value) {
                  addEdgeCondition(id, { id: nanoid(), variable, cond, value });
                  condition.set("value", "");
                }
              }}
            >
              Add
            </Button>
          </Group>
        </Box>

        <Table striped withTableBorder>
          {/*<Table.Thead>*/}
          {/*  <Table.Tr>*/}
          {/*    <Table.Th>Element position</Table.Th>*/}
          {/*    <Table.Th>Element name</Table.Th>*/}
          {/*    <Table.Th>Symbol</Table.Th>*/}
          {/*    <Table.Th>Atomic mass</Table.Th>*/}
          {/*  </Table.Tr>*/}
          {/*</Table.Thead>*/}
          <Table.Tbody>
            {data?.conditions?.map((condition) => (
              <Table.Tr key={condition.id}>
                <Table.Td>
                  <Group align={"center"}>
                    <ThemeIcon variant={"light"} size={24} radius="sm">
                      <IconVariable
                        style={{ width: rem(16), height: rem(16) }}
                      />
                    </ThemeIcon>
                    <p>{condition.variable}</p>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Chip checked={false}>=</Chip>
                </Table.Td>
                <Table.Td>
                  <Group align={"center"} gap={"lg"}>
                    <p>{condition.value}</p>
                    <ActionIcon
                      size={"xs"}
                      variant={"light"}
                      color={"red"}
                      onClick={() => {
                        removeEdgeCondition(id, condition.id);
                      }}
                    >
                      <IconTrash
                        style={{ width: rem(16), height: rem(16) }}
                      ></IconTrash>
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Drawer>

      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          {/*<ActionIcon*/}
          {/*  size={"xs"}*/}
          {/*  variant={data?.conditions?.length ? "filled" : "default"}*/}
          {/*  onClick={open}*/}
          {/*>*/}
          {/*  <IconVariable />*/}
          {/*</ActionIcon>*/}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
