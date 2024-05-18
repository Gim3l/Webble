import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  getNodesBounds,
  type Node,
  NodeChange,
  useReactFlow,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import { proxy } from "valtio";
import { type ElementNode } from "./elements/config";
import { useState } from "react";
import graph from "~/components/collect/Graph";
import { layoutD3DAG } from "~/components/collect/utils/node/algorithms/d3-dag";

export type GroupNodeData = { name: string };
export type NewNodeData = {};

export const graphStore = proxy<{
  nodes: Node[];
  edges: Edge[];
  movingNodeId: string | null;
  selectedNodes: Node[];
  currentPopoverId: string | null;
}>({
  movingNodeId: null,
  selectedNodes: [],
  currentPopoverId: null,
  edges: [],
  nodes: [
    {
      id: "start",
      type: "start",
      data: {},
      position: { x: 500, y: 500 },
    },
  ],
});

export function onNodesChange(changes: NodeChange[]) {
  graphStore.nodes = applyNodeChanges(changes, graphStore.nodes);
}

export function onEdgesChange(changes: EdgeChange[]) {
  graphStore.edges = applyEdgeChanges(changes, graphStore.edges);
}

export function onConnect(connection: Connection) {
  graphStore.edges = addEdge(connection, graphStore.edges);
}

// const onConnect = useCallback((params) => {
//   // reset the start node on connections
//   connectingNodeId.current = null;
//   setEdges((eds) => addEdge(params, eds));
// }, []);

export function setSelectedNodes(selectedNodes: Node[]) {
  graphStore.selectedNodes = selectedNodes;
}

export function getNodeById(id: string) {
  return graphStore.nodes.find((n) => n.id === id);
}

export async function autoLayout() {
  const { edges, nodes } = await layoutD3DAG({
    algorithm: "d3-dag",
    nodes: graphStore.nodes,
    edges: graphStore.edges,
    direction: "horizontal",
    spacing: { x: 60, y: 60 },
    visibility: "visible",
  });

  graphStore.edges = edges;
  graphStore.nodes = nodes;
}

export function setNodes(nodes: Node[]) {
  graphStore.nodes = nodes;
}
export function setEdges(edges: Edge[]) {
  graphStore.edges = edges;
}

export function moveNode(id: string | null) {
  graphStore.movingNodeId = id;
}

export function openPopover(id: string | null) {
  graphStore.currentPopoverId = id;
}

export function updateNode<T extends Record<string, any>>(id: string, data: T) {
  graphStore.nodes = graphStore.nodes.map((n) => {
    if (n.id === id) {
      console.log("Updating " + id);
      return { ...n, data: { ...n.data, ...data } };
    }

    return n;
  });
}

export function createElementNode(
  node: Pick<ElementNode, "id" | "type" | "data" | "position">,
  placeholderId: string,
) {
  console.log({ node, placeholderId });
  graphStore.nodes = graphStore.nodes.filter((n) => n.id !== placeholderId);
  const edge = graphStore.edges.find((edge) => edge.target === placeholderId);
  if (!edge) return;

  graphStore.edges = graphStore.edges.filter((e) => e.id !== edge?.id);

  graphStore.nodes = [...graphStore.nodes, node];

  const newEdge: Edge = {
    id: nanoid(),
    source: edge.source,
    target: node.id,
  };

  console.log({ theEdge: { ...edge } });

  if (!!edge.sourceHandle) newEdge.sourceHandle = edge.sourceHandle;
  if (!!edge.targetHandle) newEdge.sourceHandle = edge.targetHandle;

  graphStore.edges = [...graphStore.edges, newEdge];
}

export function createCollectionNode({ offset = 40 }: { offset?: number }) {
  const bounds = getNodesBounds(graphStore.selectedNodes);
  console.log({ bounds });

  const collectionNodeId = nanoid();
  const collectionNode = {
    id: collectionNodeId,
    type: "collection",
    position: { x: bounds.x - offset / 2, y: bounds.y - offset / 2 },
    data: {},
    width: bounds.width + offset,
    height: bounds.height + offset,
  };

  // reactFlow.addNodes(collectionNode);

  const nodes = graphStore.nodes;

  const selectedNodesIds = graphStore.selectedNodes.map((n) => n.id);
  const otherNodes = nodes.filter(
    (node) => !selectedNodesIds.includes(node.id),
  );
  const updatedNodes: Node[] = nodes
    .filter((node) => selectedNodesIds.includes(node.id))
    .map((node) => {
      return {
        ...node,
        position: {
          x: node.position!.x - collectionNode.position.x,
          y: node.position!.y - collectionNode.position.y,
        },
        parentId: collectionNodeId,
        extent: "parent",
      };
    });

  graphStore.nodes = [collectionNode, ...otherNodes, ...updatedNodes];
}

export function deleteNode(nodeId: string) {
  graphStore.edges = graphStore.edges.filter(
    (e) => e.target !== nodeId || e.source !== nodeId,
  );
  graphStore.nodes = graphStore.nodes.filter((node) => node.id !== nodeId);
}

export function swapNodePositions(fromNodeId: string, toNodeId: string) {
  const nodes = graphStore.nodes;
  const edges = graphStore.edges;

  console.log({ edges, nodes });

  const fromNodeIndex = nodes.findIndex((node) => node.id === fromNodeId);
  const toNodeIndex = nodes.findIndex((node) => node.id === toNodeId);
  const fromNode = nodes[fromNodeIndex];
  const toNode = nodes[toNodeIndex];

  if (!fromNode || !toNode) {
    console.warn("[Webble] Cannot find node targets");
    return;
  }

  const newToNode: Node = {
    ...toNode,
    position: { x: fromNode.position.x, y: fromNode.position.y },
    // positionAbsolute: fromNode.positionAbsolute,
    parentId: fromNode.parentId,
    targetPosition: fromNode.targetPosition,
    extent: fromNode.extent ? fromNode.extent : toNode.extent,
  };

  const newFromNode: Node = {
    ...fromNode,
    position: { x: toNode.position.x, y: toNode.position.y },
    // positionAbsolute: toNode.positionAbsolute,
    parentId: toNode.parentId,
    extent: toNode.extent ? toNode.extent : fromNode.extent,
    targetPosition: toNode.targetPosition,
  };

  const newNodes = [...nodes];

  newNodes[fromNodeIndex] = newToNode;
  newNodes[toNodeIndex] = newFromNode;

  // update edges
  const fromNodeEdges = edges.filter(
    (edge) => edge.source === fromNodeId || edge.target === fromNodeId,
  );
  const toNodeEdges = edges.filter(
    (edge) => edge.source === toNodeId || edge.target === toNodeId,
  );

  const affectedEdges = Array.from(new Set([...fromNodeEdges, ...toNodeEdges]));

  const otherEdges = edges.filter(
    (e) => !affectedEdges.map((edge) => edge.id).includes(e.id),
  );
  const newEdges = affectedEdges.map((edge) => {
    // checks if edges are directly connected
    if (
      (edge.source === fromNodeId && edge.target === toNodeId) ||
      (edge.source === toNodeId && edge.target === fromNodeId)
    ) {
      return {
        ...edge,
        source: edge.target,
        target: edge.source,
      };
    }

    // handle to node
    if (edge.source === toNodeId) {
      return { ...edge, source: fromNodeId };
    } else if (edge.target === toNodeId) {
      return { ...edge, target: fromNodeId };
    }

    if (edge.source === fromNodeId) {
      return { ...edge, source: toNodeId };
    } else if (edge.target === fromNodeId) {
      return { ...edge, target: toNodeId };
    }

    return edge;
  });

  graphStore.edges = [...otherEdges, ...newEdges];
  graphStore.nodes = newNodes;
}

// returns the bounds for the nodes in a collection
export function getCollectionChildNodeBounds(collectionId: string) {
  const nodes = graphStore.nodes.filter((n) => n.parentId === collectionId);

  return getNodesBounds(nodes);
}

export { ElementNode };

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}
