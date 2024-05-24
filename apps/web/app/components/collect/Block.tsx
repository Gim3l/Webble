import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Text, Card, Group, ThemeIcon } from "@mantine/core";
import { Icon } from "@tabler/icons-react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ElementTypes, GroupElement } from "@webble/elements";
import { nanoid } from "nanoid";

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
    invariant(ref.current);
    return draggable({
      getInitialData() {
        return { id: nanoid(), data: initialData, type } satisfies GroupElement;
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
  }, []);

  return (
    <Card shadow={"none"} ref={ref} opacity={isDragging ? 0.5 : 1}>
      <Group>
        <ThemeIcon size={"xs"}>
          <Icon />
        </ThemeIcon>{" "}
        <Text>{name}</Text>
      </Group>
    </Card>
  );
}
