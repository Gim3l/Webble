import { Box, Card, Divider, Stack, Input, rem, Button } from "@mantine/core";
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import React, { lazy, useCallback, useEffect, useRef, useState } from "react";

import invariant from "tiny-invariant";

// import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
const DropIndicator = lazy(
  () => import("@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box"),
);
// import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
// import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";

export function getReorderDestinationIndex({
  startIndex,
  closestEdgeOfTarget,
  indexOfTarget,
  axis,
}: {
  startIndex: number;
  closestEdgeOfTarget: "top" | "bottom" | "right" | null;
  indexOfTarget: number;
  axis: "vertical" | "horizontal";
}): number {
  // invalid index's
  if (startIndex === -1 || indexOfTarget === -1) {
    return startIndex;
  }

  // if we are targeting the same index we don't need to do anything
  if (startIndex === indexOfTarget) {
    return startIndex;
  }

  if (closestEdgeOfTarget == null) {
    return indexOfTarget;
  }

  const isGoingAfter: boolean =
    (axis === "vertical" && closestEdgeOfTarget === "bottom") ||
    (axis === "horizontal" && closestEdgeOfTarget === "right");

  const isMovingForward: boolean = startIndex < indexOfTarget;
  // moving forward
  if (isMovingForward) {
    return isGoingAfter ? indexOfTarget : indexOfTarget - 1;
  }
  // moving backwards
  return isGoingAfter ? indexOfTarget + 1 : indexOfTarget;
}

import {
  GroupElement,
  GroupNodeData,
  isGroupElement,
  TYPE_CHOICE_INPUT_ELEMENT,
  TYPE_EMAIL_INPUT_ELEMENT,
  TYPE_IMAGE_BUBBLE_ELEMENT,
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
import classes from "./GroupNode.module.css";
import { useFocusWithin } from "@mantine/hooks";
import ImageBubbleElement from "~/components/collect/elements/ImageBubbleElement";

export function reorder<Value>({
  list,
  startIndex,
  finishIndex,
}: {
  list: Value[];
  startIndex: number;
  finishIndex: number;
}): Value[] {
  if (startIndex === -1 || finishIndex === -1) {
    return list;
  }

  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(finishIndex, 0, removed);

  return result;
}

export function CollectionNode(
  node: NodeProps<Node<GroupNodeData, "container">>,
) {
  const reactFlow = useReactFlow<Node<GroupNodeData, "container">>();
  const ref = useRef(null);
  const { ref: titleInputRef, focused } = useFocusWithin();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!focused) setIsEditing(false);
  }, [focused]);

  const reorderItem = useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number;
      indexOfTarget: number;
      closestEdgeOfTarget: "top" | "bottom" | null;
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
    const controller = new AbortController();

    (async () => {
      const { monitorForElements } = await import(
        "@atlaskit/pragmatic-drag-and-drop/element/adapter"
      );
      const { extractClosestEdge } = await import(
        "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
      );
      if (controller.signal.aborted) {
        return;
      }
      const el = ref.current;
      if (!el) {
        return;
      }

      const cleanup = monitorForElements({
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

          let indexOfTarget = node.data.elements.findIndex(
            (item) => item.id === targetData.id,
          );

          // handle moving items between groups
          if (sourceData.groupId !== targetData.groupId) {
            const targetGroup = reactFlow
              .getNodes()
              .find((node) => node.id === targetData.groupId);

            if (!targetGroup) return;

            indexOfTarget = targetGroup.data.elements.findIndex(
              (item) => item.id === targetData.id,
            );

            // alert(targetData.index);
            if (closestEdgeOfTarget === "top") {
              addElementToGroup(targetData.groupId, sourceData, indexOfTarget);

              removeElementFromGroup(sourceData.groupId, sourceData.id);
              removeEmptyGroups();
            }

            if (closestEdgeOfTarget === "bottom") {
              addElementToGroup(
                targetData.groupId,
                sourceData,
                indexOfTarget + 1,
                // targetData.index + 1,
              );
              removeElementFromGroup(sourceData.groupId, sourceData.id);
              removeEmptyGroups();
            }

            return;
          }

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

          // triggerPostMoveFlash(source.element);
          updateNodeInternals(node.id);
        },
      });
      controller.signal.addEventListener("abort", cleanup, { once: true });
    })();

    return () => {
      controller.abort();
    };
  }, [node.data.elements, reorderItem, node.id]);

  // useEffect(() => {
  //   return monitorForElements({
  //     canMonitor({ source }) {
  //       return source.data.groupId === node.id;
  //     },
  //     onDrop({ location, source }) {
  //       console.log({ location, source });
  //       const target = location.current.dropTargets[0];
  //       if (!target) {
  //         return;
  //       }
  //
  //       const sourceData = source.data;
  //       const targetData = target.data;
  //       if (!isGroupElement(sourceData) || !isGroupElement(targetData)) {
  //         return;
  //       }
  //
  //       const closestEdgeOfTarget = extractClosestEdge(targetData);
  //
  //       let indexOfTarget = node.data.elements.findIndex(
  //         (item) => item.id === targetData.id,
  //       );
  //
  //       // handle moving items between groups
  //       if (sourceData.groupId !== targetData.groupId) {
  //         const targetGroup = reactFlow
  //           .getNodes()
  //           .find((node) => node.id === targetData.groupId);
  //
  //         if (!targetGroup) return;
  //
  //         indexOfTarget = targetGroup.data.elements.findIndex(
  //           (item) => item.id === targetData.id,
  //         );
  //
  //         // alert(targetData.index);
  //         if (closestEdgeOfTarget === "top") {
  //           addElementToGroup(targetData.groupId, sourceData, indexOfTarget);
  //
  //           removeElementFromGroup(sourceData.groupId, sourceData.id);
  //           removeEmptyGroups();
  //         }
  //
  //         if (closestEdgeOfTarget === "bottom") {
  //           addElementToGroup(
  //             targetData.groupId,
  //             sourceData,
  //             indexOfTarget + 1,
  //             // targetData.index + 1,
  //           );
  //           removeElementFromGroup(sourceData.groupId, sourceData.id);
  //           removeEmptyGroups();
  //         }
  //
  //         return;
  //       }
  //
  //       if (indexOfTarget < 0) {
  //         return;
  //       }
  //
  //       if (target.data) {
  //         reorderItem({
  //           startIndex: sourceData.index,
  //           indexOfTarget,
  //           closestEdgeOfTarget,
  //         });
  //       }
  //
  //       triggerPostMoveFlash(source.element);
  //       updateNodeInternals(node.id);
  //     },
  //   });
  // }, [node.data.elements, reorderItem, node.id]);

  const { hoveredEdge } = useSnapshot(graphStore);

  return (
    <>
      <Handle type="target" position={Position.Left} id={node.id} />
      <Handle type="source" position={Position.Right} id={node.id} />
      <Card
        withBorder
        w={260}
        ref={ref}
        px={0}
        style={{
          borderColor:
            node.selected ||
            hoveredEdge?.source === node.id ||
            hoveredEdge?.target === node.id
              ? "var(--mantine-primary-color-5)"
              : undefined,
          overflow: "visible",
        }}
      >
        <Input
          ref={titleInputRef}
          onClick={() => setIsEditing(true)}
          className={isEditing ? "nodrag" : ""}
          defaultValue={node.data.name}
          classNames={{ wrapper: classes.inputWrapper, input: classes.input }}
          styles={{
            wrapper: { margin: 0 },
            input: {},
          }}
        />

        <Divider my={"xs"} />
        <Stack gap={2}>
          {node.data.elements.map((el, index) => (
            <GroupItem groupId={node.id} key={el.id} index={index} data={el} />
          ))}
          <Button
            size={"compact-xs"}
            fz={"xs"}
            py={0}
            variant={"transparent"}
            color={"dark.2"}
          >
            Add Element
          </Button>
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
    [TYPE_IMAGE_BUBBLE_ELEMENT]: ImageBubbleElement,
  };

  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<"top" | "bottom" | null>(null);
  const ElementComp = elementTypes[data.type];
  const { allowElementDrag } = useSnapshot(graphStore);

  useEffect(() => {
    const controller = new AbortController();

    const element = ref.current;
    invariant(element);

    (async () => {
      const { attachClosestEdge, extractClosestEdge } = await import(
        "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
      );
      const { combine } = await import(
        "@atlaskit/pragmatic-drag-and-drop/combine"
      );
      const { draggable, dropTargetForElements } = await import(
        "@atlaskit/pragmatic-drag-and-drop/element/adapter"
      );
      if (controller.signal.aborted) {
        return;
      }
      const el = ref.current;
      if (!el) {
        return;
      }

      const cleanup = combine(
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
      controller.signal.addEventListener("abort", cleanup, { once: true });
    })();

    return () => {
      controller.abort();
    };
  }, [data, index]);

  return (
    <Box className={"nodrag"} pos={"relative"} ref={ref}>
      <Card
        px="sm"
        py="xs"
        w="100%"
        opacity={isDragging ? 0.5 : 1}
        radius={"none"}
        bg={"dark.8"}
        withBorder
        style={{ cursor: "pointer", overflow: "visible" }}
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
    const controller = new AbortController();
    invariant(ref.current);

    (async () => {
      const { draggable } = await import(
        "@atlaskit/pragmatic-drag-and-drop/element/adapter"
      );
      if (controller.signal.aborted) {
        return;
      }
      const el = ref.current;
      if (!el) {
        return;
      }

      const cleanup = draggable({
        element: ref.current,
        canDrag() {
          return false;
        },
      });
      controller.signal.addEventListener("abort", cleanup, { once: true });
    })();

    return () => {
      controller.abort();
    };
  }, [ref, sourceId, targetId]);

  return (
    <div ref={ref} className={"element-handle"}>
      <Handle
        type={"target"}
        draggable={"false"}
        // className={"element-handle"}
        // style={{ left: 0 }}
        position={Position.Left}
        id={targetId}
      ></Handle>
      <Handle
        draggable={"false"}
        type={"source"}
        // style={{ right: 0 }}
        position={Position.Right}
        id={sourceId}
      ></Handle>
    </div>
  );
}
