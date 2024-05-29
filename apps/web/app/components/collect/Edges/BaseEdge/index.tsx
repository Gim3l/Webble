import { ComponentType, memo } from "react";
import { EdgeProps, BaseEdge as _BaseEdge } from "@xyflow/react";
import { ReactflowEdgeWithData } from "~/components/collect/utils/data/type";
import { isConnectionBackward } from "~/components/collect/utils/edge/edge";
import {
  getEdgeStyles,
  layoutEdge,
} from "~/components/collect/utils/edge/style";
import { getEdgeById, setEdgeLayout } from "~/components/collect/store";
import { useRebuildEdge } from "~/components/collect/Edges/BaseEdge/useRebuildEdge";
import { EdgeControllers } from "~/components/collect/Edges/EdgeController";

// import { ReactflowEdgeWithData } from "@/data/types";
// import { isConnectionBackward } from "@/layout/edge/edge";
// import { getEdgeStyles, layoutEdge } from "@/layout/edge/style";
// import { kReactflow } from "@/states/reactflow";
// import { EdgeControllers } from "../EdgeController";
// import { useRebuildEdge } from "./useRebuildEdge";

export const BaseEdge: ComponentType<EdgeProps<ReactflowEdgeWithData>> = memo(
  ({
    id,
    selected,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    style,
    sourcePosition,
    targetPosition,
    markerStart,
    interactionWidth,
  }) => {
    useRebuildEdge(id);

    const isBackward = isConnectionBackward({
      source: {
        id,
        x: sourceX,
        y: sourceY,
        position: sourcePosition,
      },
      target: {
        id,
        x: targetX,
        y: targetY,
        position: targetPosition,
      },
    });

    const { color, edgeType, pathType } = getEdgeStyles({ id, isBackward });

    const offset = 20;
    const borderRadius = 12;
    const handlerWidth = 24;
    const handlerThickness = 6;

    const edge = getEdgeById(id)!;
    // console.log({ edge });
    setEdgeLayout(
      id,
      layoutEdge({
        layout: edge.data?.layout,
        id,
        offset,
        borderRadius,
        pathType,
        source,
        target,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
      }),
    );

    const edge: ReactflowEdgeWithData = getEdgeById(id)!;
    const { path, points, labelPosition } = edge.data?.layout;

    return (
      <>
        <_BaseEdge
          path={path}
          labelX={labelPosition.x}
          labelY={labelPosition.y}
          label={label}
          labelStyle={labelStyle}
          labelShowBg={labelShowBg}
          labelBgStyle={labelBgStyle}
          labelBgPadding={labelBgPadding}
          labelBgBorderRadius={labelBgBorderRadius}
          style={{
            ...style,
            stroke: color,
            opacity: selected ? 1 : 0.5,
            strokeWidth: selected ? 2 : 1.5,
            strokeDasharray: edgeType === "dashed" ? "10,10" : undefined,
          }}
          markerEnd={`url('#${color.replace("#", "")}')`}
          markerStart={markerStart}
          interactionWidth={interactionWidth}
        />
        {selected && (
          <EdgeControllers
            id={id}
            points={points}
            sourcePosition={sourcePosition}
            targetPosition={targetPosition}
            offset={offset}
            handlerWidth={handlerWidth}
            handlerThickness={handlerThickness}
          />
        )}
      </>
    );
  },
);

BaseEdge.displayName = "BaseEdge";
