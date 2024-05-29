import { getControlPoints, GetControlPointsParams } from "./algorithms";
import { getLabelPosition, getPathWithRoundCorners } from "./edge";
import { getNodeById } from "~/components/collect/store";
import { GroupNodeData } from "@webble/elements";
import { Node } from "@xyflow/react";
import { EdgeLayout } from "~/components/collect/utils/data/type";

interface GetBasePathParams extends GetControlPointsParams {
  borderRadius: number;
}

export function getBasePath({
  id,
  offset,
  borderRadius,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: any) {
  const sourceNode: Node<GroupNodeData> = getNodeById(source)!;
  const targetNode: Node<GroupNodeData> = getNodeById(target)!;
  return getPathWithPoints({
    offset,
    borderRadius,
    source: {
      id: "source-" + id,
      x: sourceX,
      y: sourceY,
      position: sourcePosition,
    },
    target: {
      id: "target-" + id,
      x: targetX,
      y: targetY,
      position: targetPosition,
    },
    sourceRect: {
      x: sourceNode.position.x,
      y: sourceNode.position.y,
      width: sourceNode.width!,
      height: sourceNode.height!,
    },
    targetRect: {
      x: targetNode.position.x,
      y: targetNode.position.y,
      width: targetNode.width!,
      height: targetNode.height!,
    },
  });
}

export function getPathWithPoints({
  source,
  target,
  sourceRect,
  targetRect,
  offset = 20,
  borderRadius = 16,
}: GetBasePathParams): EdgeLayout {
  const { points, inputPoints } = getControlPoints({
    source,
    target,
    offset,
    sourceRect,
    targetRect,
  });
  const labelPosition = getLabelPosition(points);
  const path = getPathWithRoundCorners(points, borderRadius);
  return { path, points, inputPoints, labelPosition };
}
