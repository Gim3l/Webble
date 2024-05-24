import {
  Box,
  Card,
  Title,
  isLightColor,
  useMantineTheme,
  Divider,
  Stack,
} from "@mantine/core";
import {
  Handle,
  Node,
  NodeProps,
  NodeResizer,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge,
  Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import DropIndicator from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import {
  GroupElement,
  GroupNodeData,
  isGroupElement,
  TYPE_CHOICE_INPUT_ELEMENT,
  TYPE_EMAIL_INPUT_ELEMENT,
  TYPE_INPUT_ELEMENT,
  TYPE_NUMBER_INPUT_ELEMENT,
  TYPE_TEXT_BUBBLE_ELEMENT,
} from "@webble/elements";
import InputElement from "~/components/collect/elements/InputElement";
import NumberInputElement from "~/components/collect/elements/NumberInputElement";
import TextBubbleElement from "~/components/collect/elements/TextBubbleElement";
import ChoiceInputElement from "~/components/collect/elements/ChoiceInputElement";
import EmailInputElement from "~/components/collect/elements/EmailInputElement";
import { useSnapshot } from "valtio/react";
import {
  addElementToGroup,
  graphStore,
  removeElementFromGroup,
  removeEmptyGroups,
} from "~/components/collect/store";

export function CollectionNode(
  node: NodeProps<Node<GroupNodeData, "container">>,
) {
  const reactFlow = useReactFlow<Node<GroupNodeData, "container">>();
  const ref = useRef(null);

  const reorderItem = useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number;
      indexOfTarget: number;
      closestEdgeOfTarget: Edge | null;
    }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        closestEdgeOfTarget,
        indexOfTarget,
        axis: "vertical",
      });

      if (finishIndex === startIndex) {
        // If there would be no change, we skip the update
        return;
      }

      reactFlow.updateNodeData(node.id, {
        ...node.data,
        elements: reorder({
          list: node.data.elements,
          startIndex,
          finishIndex,
        }),
      });
    },
    [node.data.elements, node.id],
  );

  // when handles move we need to inform react flow
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return source.data.groupId === node.id;
      },
      onDrop({ location, source }) {
        console.log({ location, source });
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;
        if (!isGroupElement(sourceData) || !isGroupElement(targetData)) {
          return;
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        // handle moving items between groups
        if (sourceData.groupId !== targetData.groupId) {
          if (closestEdgeOfTarget === "top") {
            addElementToGroup(targetData.groupId, sourceData, targetData.index);
            removeElementFromGroup(sourceData.groupId, sourceData.id);
            removeEmptyGroups();
          }

          if (closestEdgeOfTarget === "bottom") {
            addElementToGroup(
              targetData.groupId,
              sourceData,
              targetData.index + 1,
            );
            removeElementFromGroup(sourceData.groupId, sourceData.id);
            removeEmptyGroups();
          }

          return;
        }

        const indexOfTarget = node.data.elements.findIndex(
          (item) => item.id === targetData.id,
        );
        if (indexOfTarget < 0) {
          return;
        }

        if (target.data) {
          reorderItem({
            startIndex: sourceData.index,
            indexOfTarget,
            closestEdgeOfTarget,
          });
        }

        triggerPostMoveFlash(source.element);
        updateNodeInternals(node.id);
      },
    });
  }, [node.data.elements, reorderItem, node.id]);

  return (
    <>
      <Handle type="target" position={Position.Left} id={node.id} />
      <Handle type="source" position={Position.Right} id={node.id} />
      <Card withBorder w={260} ref={ref}>
        <Title order={4}>{node.data.name}</Title>

        <Divider />
        <Stack pt={"sm"} gap={2}>
          {node.data.elements.map((el, index) => (
            <GroupItem groupId={node.id} key={el.id} index={index} data={el} />
          ))}
        </Stack>
      </Card>
    </>
  );
}

export function GroupItem({
  groupId,
  index,
  data,
}: {
  groupId: string;
  index: number;
  data: GroupElement;
}) {
  const elementTypes = {
    [TYPE_INPUT_ELEMENT]: InputElement,
    [TYPE_NUMBER_INPUT_ELEMENT]: NumberInputElement,
    [TYPE_TEXT_BUBBLE_ELEMENT]: TextBubbleElement,
    [TYPE_CHOICE_INPUT_ELEMENT]: ChoiceInputElement,
    [TYPE_EMAIL_INPUT_ELEMENT]: EmailInputElement,
  };

  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const ElementComp = elementTypes[data.type];
  const { allowElementDrag } = useSnapshot(graphStore);

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return combine(
      draggable({
        element,
        canDrag() {
          return allowElementDrag;
        },
        getInitialData() {
          return { ...data, groupId, index };
        },
        onDragStart() {
          setIsDragging(true);
        },
        onDrop() {
          setIsDragging(false);
        },
      }),
      dropTargetForElements({
        element: ref.current,
        getData({ input }) {
          return attachClosestEdge(
            { index, ...data },
            {
              element,
              input,
              allowedEdges: ["top", "bottom"],
            },
          );
        },
        onDrag({ source, self }) {
          const isSource = source.element === element;
          if (isSource) {
            setClosestEdge(null);
            return;
          }

          const closestEdge = extractClosestEdge(self.data);

          const sourceIndex = source.data.index;
          invariant(typeof sourceIndex === "number");

          const isItemBeforeSource = index === sourceIndex - 1;
          const isItemAfterSource = index === sourceIndex + 1;

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === "bottom") ||
            (isItemAfterSource && closestEdge === "top");

          if (isDropIndicatorHidden) {
            setClosestEdge(null);
            return;
          }

          setClosestEdge(closestEdge);
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },
      }),
    );
  }, [data, index]);

  return (
    <Box className={"nodrag"} pos={"relative"} ref={ref}>
      <Card
        px="sm"
        py="xs"
        w="100%"
        opacity={isDragging ? 0.5 : 1}
        bg={"dark.8"}
        withBorder
        style={{ cursor: "pointer" }}
      >
        <ElementComp {...data} />
      </Card>
      {closestEdge && <DropIndicator edge={closestEdge} />}
    </Box>
  );
}

export function ElementHandles({
  sourceId,
  targetId,
}: {
  targetId: string;
  sourceId: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    invariant(ref.current);

    return draggable({
      element: ref.current,
      canDrag() {
        return false;
      },
    });
  }, [ref, sourceId, targetId]);

  return (
    <div ref={ref}>
      <Handle
        type={"target"}
        style={{ left: 0 }}
        position={Position.Left}
        id={targetId}
      ></Handle>
      <Handle
        type={"source"}
        style={{ right: 0 }}
        position={Position.Right}
        id={sourceId}
      ></Handle>
    </div>
  );
}
