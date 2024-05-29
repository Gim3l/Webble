import React from "react";
import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { useHovered } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useSnapshot } from "valtio/react";
import { graphStore } from "~/components/collect/store";

export default function BasicEdge({
  id,
  sourceX,
  selected,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  // const { setEdges } = useReactFlow();
  const { hoveredEdge } = useSnapshot(graphStore);
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // const onEdgeClick = () => {
  //   setEdges((edges) => edges.filter((edge) => edge.id !== id));
  // };

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={
        selected || hoveredEdge?.id === id
          ? "url('#1__color=var(--mantine-primary-color-3)&type=arrowclosed')"
          : "url('#2__color=var(--mantine-color-dark-3)&type=arrowclosed')"
      }
      style={{
        ...style,
        stroke:
          selected || hoveredEdge?.id === id
            ? "var(--mantine-primary-color-3)"
            : style.stroke,
      }}
    />
  );
}
