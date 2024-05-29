import { EdgeLabelRenderer, Position, useReactFlow } from "@xyflow/react";

import { getEdgeContext, SmartEdge } from "./smart-edge";
import { useEdgeDraggable } from "./useEdgeDraggable";
import { ControlPoint } from "~/components/collect/utils/edge/point";
import { getLineCenter, ILine } from "~/components/collect/utils/edge/edge";
import { nanoid } from "nanoid";

export interface EdgeControllersParams {
  id: string;
  points: ControlPoint[];
  sourcePosition: Position;
  targetPosition: Position;
  offset: number;
  handlerWidth: number;
  handlerThickness: number;
}

export const EdgeControllers = (props: EdgeControllersParams) => {
  const { points } = props;
  const edges: ILine[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    edges.push({ start: points[i], end: points[i + 1] });
  }
  const edgeContext = getEdgeContext(props);
  const smartEdges = edges.map((e, idx) => {
    return new SmartEdge({ idx, start: e.start, end: e.end, ctx: edgeContext });
  });
  smartEdges.forEach((e, idx) => {
    e.previous = smartEdges[idx - 2];
    e.next = smartEdges[idx + 2];
  });

  return (
    <>
      {edges.map((_, idx) => {
        const edge = smartEdges[idx];
        return edge.canDrag && <EdgeController key={nanoid()} edge={edge} />; // use uuid to force rebuild EdgeController
      })}
    </>
  );
};

export const EdgeController = ({ edge }: { edge: SmartEdge }) => {
  const { start, end, onDragging } = edge;
  const { handlerWidth, handlerThickness } = edge.ctx;
  const center = getLineCenter(start, end);
  const isHorizontal = start.y === end.y;
  const { screenToFlowPosition } = useReactFlow();

  const { dragRef } = useEdgeDraggable({
    edge,
    onDragging(dragId, dragFrom, position, delta) {
      const oldFlowPosition = screenToFlowPosition({
        x: position.x - delta.x,
        y: position.y - delta.y,
      });
      const newFlowPosition = screenToFlowPosition(position);
      const flowDelta = {
        x: newFlowPosition.x - oldFlowPosition.x,
        y: newFlowPosition.y - oldFlowPosition.y,
      };
      const newStart = { ...start };
      const newEnd = { ...end };
      if (isHorizontal) {
        newStart.y += flowDelta.y;
        newEnd.y += flowDelta.y;
      } else {
        newStart.x += flowDelta.x;
        newEnd.x += flowDelta.x;
      }
      onDragging({
        dragId,
        dragFrom,
        from: { start, end },
        to: { start: newStart, end: newEnd },
      });
    },
  });

  return (
    <EdgeLabelRenderer>
      <div
        ref={dragRef}
        className="nodrag nopan"
        style={{
          cursor: isHorizontal ? "row-resize" : "col-resize",
          position: "absolute",
          transform: `translate(-50%, -50%) translate(${center.x}px,${center.y}px)`,
          width: isHorizontal ? `${handlerWidth}px` : `${handlerThickness}px`,
          height: !isHorizontal ? `${handlerWidth}px` : `${handlerThickness}px`,
          borderRadius: "2px",
          background: "#3579f6",
          border: "1px solid #fff",
          pointerEvents: "all",
        }}
      />
    </EdgeLabelRenderer>
  );
};
