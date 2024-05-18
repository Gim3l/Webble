import {
  ActionIcon,
  Box,
  Card,
  Divider,
  Flex,
  Input,
  Popover,
  ScrollArea,
  Stack,
  Title,
  isLightColor,
  useMantineTheme,
} from "@mantine/core";
import {
  Handle,
  NodeResizer,
  Position,
  useOnSelectionChange,
  useReactFlow,
  useStoreApi,
} from "@xyflow/react";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import React from "react";
import { getCollectionChildNodeBounds } from "~/components/collect/store";

export function CollectionNode({
  id,
  data,
  ...node
}: {
  data: any;
  id: string;
}) {
  const [isSelected, setIsSelected] = useState(false);
  const reactFlow = useReactFlow();
  const nodeInfo = reactFlow.getNodes().find((n) => n.id === id);
  const bounds = getCollectionChildNodeBounds(id);
  console.log({ nodeInfo });

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setIsSelected(nodes.map((node) => node.id).includes(id));
    },
  });

  const theme = useMantineTheme();

  return (
    <>
      <Box
        bg={theme.primaryColor}
        pos={"absolute"}
        px={"md"}
        style={{
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
        }}
      >
        <Title
          c={
            isLightColor(theme.colors[theme.primaryColor][7])
              ? "black"
              : "white"
          }
          order={4}
          onClick={() => {
            console.log("COLLECTION", node);
            console.log(reactFlow.getNodes());
          }}
        >
          Hello
        </Title>
      </Box>
      <NodeResizer
        color={theme.colors[theme.primaryColor][7]}
        minWidth={bounds.width + 50}
        minHeight={bounds.height + 50}
        lineStyle={{
          border: `2px solid ${theme.colors[theme.primaryColor][7]}`,
        }}
        // shouldResize={(resize) => {
        //   const bounds = getCollectionChildNodeBounds(id);
        //   console.log({ bounds });
        //   if (
        //     resize.subject.x <= bounds.width ||
        //     resize.subject.y < bounds.height
        //   ) {
        //     return false;
        //   }
        //   // console.log({ resize });
        //   return true;
        // }}
      />

      <Card
        withBorder
        w={nodeInfo?.width || undefined}
        h={nodeInfo?.height || undefined}
        opacity={0.2}
        // style={{
        //   overflow: "hidden",
        //   borderWidth: "2px",
        //   borderColor: isSelected
        //     ? theme.colors[theme.primaryColor][9]
        //     : theme.colors["teal"][9],
        // }}
      >
        {/*<Handle type="target" position={Position.Left} id={id} />*/}
        {/*<Handle type="source" position={Position.Right} id={id} />*/}
      </Card>
    </>
  );
}
