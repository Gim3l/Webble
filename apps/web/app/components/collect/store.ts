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
} from "@xyflow/react";
import { nanoid } from "nanoid";
import { layoutD3DAG } from "~/components/collect/utils/node/algorithms/d3-dag";
import { proxy } from "valtio";
import {
  EdgeData,
  elementHasOptions,
  ElementNode,
  ElementTypes,
  GroupElement,
  GroupNodeData,
} from "@webble/elements";

export const graphStore = proxy<{
  nodes: Node<GroupNodeData, "collection">[];
  edges: Edge<EdgeData>[];
  movingNodeId: string | null;
  selectedNodeId: string | null;
  selectedNodes: Node[];
  currentPopoverId: string | null;
  isDraggingNode: boolean;
  allowElementDrag: boolean;
  hoveredEdge: Edge | null;
}>({
  movingNodeId: null,
  allowElementDrag: true,
  selectedNodeId: null,
  isDraggingNode: false,
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

export function setHoveredEdge(edge: Edge | null) {
  graphStore.hoveredEdge = edge;
}

export function setSelectedNodes(selectedNodes: Node[]) {
  graphStore.selectedNodes = selectedNodes;
}

export function getNodeById(id: string) {
  return graphStore.nodes.find((n) => n.id === id);
}

export function getEdgeById(id: string) {
  return graphStore.edges.find((e) => e.id === id);
}

export function setEdgeLayout(id: string, layout: any) {
  return graphStore.edges.map((e) => {
    if (e.id === id) {
      return { ...e, data: { ...(e.data || {}), layout } };
    }

    return e;
  });
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
      return { ...n, data: { ...n.data, ...data } };
    }

    return n;
  });
}

export function createElementNode(
  node: Pick<Node<GroupNodeData>, "id" | "type" | "data" | "position">,
  placeholderId: string,
) {
  if (!placeholderId) return (graphStore.nodes = [...graphStore.nodes, node]);

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

  if (edge.sourceHandle) newEdge.sourceHandle = edge.sourceHandle;
  if (edge.targetHandle) newEdge.sourceHandle = edge.targetHandle;

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
    const { targetHandle, sourceHandle, ...newEdge } = edge;

    // checks if edges are directly connected
    if (
      (edge.source === fromNodeId && edge.target === toNodeId) ||
      (edge.source === toNodeId && edge.target === fromNodeId)
    ) {
      return {
        ...newEdge,
        source: edge.target,
        target: edge.source,
        // sourceHandle: edge.sourceHandle || edge.source,
        // targetHandle: edge.targetHandle || edge.target,
      };
    }

    // handle to node
    if (edge.source === toNodeId) {
      if (edge.sourceHandle === null) delete edge.sourceHandle;
      return { ...newEdge, source: fromNodeId };
    } else if (edge.target === toNodeId) {
      if (edge.sourceHandle === null) delete edge.sourceHandle;
      return { ...newEdge, target: fromNodeId };
    }

    if (edge.source === fromNodeId) {
      if (edge.sourceHandle === null) delete edge.sourceHandle;
      return { ...newEdge, source: toNodeId };
    } else if (edge.target === fromNodeId) {
      if (edge.sourceHandle === null) delete edge.sourceHandle;
      return { ...newEdge, target: toNodeId };
    }

    return edge;
  });

  graphStore.edges = [...otherEdges, ...newEdges];
  graphStore.nodes = newNodes;
}

export function setSelectedNodeId(nodeId: string) {
  graphStore.selectedNodeId = nodeId;
}

// returns the bounds for the nodes in a collection
export function getCollectionChildNodeBounds(collectionId: string) {
  const nodes = graphStore.nodes.filter((n) => n.parentId === collectionId);

  return getNodesBounds(nodes);
}

export function setIsDraggingNode(value: boolean) {
  graphStore.isDraggingNode = value;
}

export function addEdgeCondition(
  id: string,
  condition: EdgeData["conditions"][0],
) {
  graphStore.edges = graphStore.edges.map((edge) => {
    if (edge.id === id) {
      return {
        ...edge,
        data: {
          conditions: [...(edge.data?.conditions || []), condition],
        },
      };
    }
    return edge;
  });
}

export function removeEdgeCondition(id: string, condId: string) {
  graphStore.edges = graphStore.edges.map((edge) => {
    if (edge.id === id) {
      const newConditions =
        edge.data?.conditions.filter((cond) => cond.id !== condId) || [];

      return {
        ...edge,
        data: {
          conditions: edge.data?.conditions ? newConditions : [],
        },
      };
    }
    return edge;
  });
}

function isGroupNode(node: Node): node is Node<GroupNodeData, "collection"> {
  return node.type === "collection";
}

export function addNode<T extends Node>(node: T) {
  if (!node.data.name) node.data.name = `Group #${graphStore.nodes.length}`;
  graphStore.nodes = [...graphStore.nodes, node];
}

export function updateGroupElement<T extends ElementTypes>(
  element: GroupElement<T>,
) {
  if (!element.groupId) return;

  graphStore.nodes = graphStore.nodes.map((node) => {
    if (node.id === element.groupId && isGroupNode(node)) {
      return {
        ...node,
        data: {
          ...node.data,
          elements: node.data.elements.map((el) => {
            if (el.id === element.id) {
              return element;
            }

            return el;
          }),
        },
      };
    }

    return node;
  });
}

export function addElementToGroup(
  groupId: string,
  element: GroupElement & { index?: number },
  // option position in which element should be added
  index?: number,
) {
  graphStore.nodes = graphStore.nodes.map((node) => {
    if (node.id !== groupId || !isGroupNode(node)) return node;

    const elements = [...node.data.elements];

    if (index === 0 || index) {
      elements.splice(index, 0, { ...element, groupId, id: element.id });
    } else {
      elements.push({ ...element, groupId, id: element.id });
    }

    return {
      ...node,
      data: {
        ...node.data,
        elements,
      },
    };
  });

  remapElementEdges(groupId, element);
}

// remap edges after element is moved from one group to another
export function remapElementEdges(groupId: string, element: GroupElement) {
  const oldGroupId = element.groupId;
  // change source id for element's edges
  // because an edge is really bound to a node and not an element
  graphStore.edges = graphStore.edges.map((edge) => {
    const newEdge = { ...edge };

    if (edge.source === oldGroupId && edge.sourceHandle === element.id) {
      newEdge.source = groupId;
      return newEdge;
    }

    if (elementHasOptions(element)) {
      for (const option of element.data.options) {
        if (edge.source === oldGroupId && edge.sourceHandle === option.id) {
          newEdge.source = groupId;
          return newEdge;
        }
      }
    }

    return edge;
  });
}

// #### GROUP BASED STUF
export function removeElementFromGroup(groupId: string, elementId: string) {
  console.log("REMOVING ELEMENTS");
  graphStore.nodes = graphStore.nodes.map((node) => {
    if (node.id !== groupId) return node;
    if (!isGroupNode(node)) return node;

    return {
      ...node,
      data: {
        ...node.data,
        elements: node.data.elements.filter((el) => el.id !== elementId),
      },
    } satisfies Node<GroupNodeData>;
  });
}

export function removeEmptyGroups() {
  graphStore.nodes = graphStore.nodes.filter((node) =>
    node.type === "collection" ? !!node.data.elements.length : !!node,
  );
}

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}
