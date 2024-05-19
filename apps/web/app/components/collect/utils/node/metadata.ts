import { MarkerType, Position, Node, Edge } from "@xyflow/react";

export type LayoutDirection = "vertical" | "horizontal";
export type LayoutVisibility = "visible" | "hidden";

import { getNodeById } from "~/components/collect/store";

export const getRootNode = (nodes: Node[]) => {
  return nodes.find((e) => e.type === "start") ?? nodes[0];
};

export const getNodeSize = (
  node: Node,
  defaultSize = { width: 150, height: 36 },
) => {
  const internalNode = getNodeById(node.id);
  const nodeWith = internalNode?.measured?.width;
  const nodeHeight = internalNode?.measured?.height;
  const hasDimension = [nodeWith, nodeHeight].every((e) => e != null);
  return {
    hasDimension,
    width: nodeWith,
    height: nodeHeight,
    widthWithDefault: nodeWith ?? defaultSize.width,
    heightWithDefault: nodeHeight ?? defaultSize.height,
  };
};

export type IFixPosition = (pros: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  x: number;
  y: number;
};
export const getNodeLayouted = (props: {
  node: Node;
  position: { x: number; y: number };
  direction: LayoutDirection;
  visibility: LayoutVisibility;
  fixPosition?: IFixPosition;
}) => {
  const {
    node,
    position,
    direction,
    visibility,
    fixPosition = (p) => ({ x: p.x, y: p.y }),
  } = props;
  const hidden = visibility !== "visible";
  const isHorizontal = direction === "horizontal";
  const { width, height, widthWithDefault, heightWithDefault } =
    getNodeSize(node);
  node.targetPosition = isHorizontal ? Position.Left : Position.Top;
  node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
  return {
    ...node,
    type: node.type,
    width,
    height,
    hidden,
    position: fixPosition({
      ...position,
      width: widthWithDefault,
      height: heightWithDefault,
    }),
    data: {
      ...node.data,
      label: node.id,
    },
    style: {
      ...node.style,
      opacity: hidden ? 0 : 1,
    },
  };
};

export const getEdgeLayouted = (props: {
  edge: Edge;
  visibility: LayoutVisibility;
}) => {
  const { edge, visibility } = props;
  const hidden = visibility !== "visible";
  return {
    ...edge,
    hidden,
    type: edge.type,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: {
      ...edge.style,
      opacity: hidden ? 0 : 1,
    },
  };
};
