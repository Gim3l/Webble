import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { ActionIcon, Drawer, Flex, Text, ThemeIcon } from "@mantine/core";
import {
  IconVariable,
  IconVariableOff,
  IconVariablePlus,
} from "@tabler/icons-react";
import { elementsConfig } from "@webble/elements";
import { useDisclosure } from "@mantine/hooks";

export default function DefaultEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
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

  return (
    <>
      <Drawer
        opened={opened}
        position={"left"}
        size={"xs"}
        onClose={() => {
          close();
        }}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        title="Edge Conditons"
      >
        cool
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
          <ActionIcon size={"xs"} variant={"filled"} onClick={open}>
            <IconVariable />
          </ActionIcon>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
