import React, { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Text, Group, ThemeIcon, Paper } from "@mantine/core";
import { Icon } from "@tabler/icons-react";
// import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import { ElementTypes, GroupElement } from "@webble/elements";
import { nanoid } from "nanoid";
import classes from "./Block.module.css";

export function Block({
  type,
  icon,
  name,
  initialData,
}: {
  type: ElementTypes;
  icon: Icon;
  name: string;
  initialData: GroupElement["data"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const Icon = icon;

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
        getInitialData() {
          return {
            id: nanoid(),
            data: initialData,
            type,
          } satisfies GroupElement;
        },
        element: ref.current,
        onDragStart({ location, source }) {
          console.log({ location });
          console.log({ source });
          setIsDragging(true);
        },
        onDrop({ location, source }) {
          setIsDragging(false);
          console.log({ location, source });
        },
      });

      controller.signal.addEventListener("abort", cleanup, { once: true });
    })();

    return () => {
      controller.abort();
    };
  }, []);

  // useEffect(() => {
  //   return
  // }, []);

  return (
    <Paper
      ref={ref}
      withBorder
      opacity={isDragging ? 0.5 : 1}
      classNames={{ root: classes.root }}
    >
      <Group>
        <ThemeIcon size={"xs"}>
          <Icon />
        </ThemeIcon>{" "}
        <Text fw={500} fz={"sm"}>
          {name}
        </Text>
      </Group>
    </Paper>
  );
}
