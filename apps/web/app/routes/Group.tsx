import { ActionIcon, Card, Group, ThemeIcon } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { IconForms } from "@tabler/icons-react";

const GroupNode = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    invariant(ref.current);

    return dropTargetForElements({
      element: ref.current,
      onDrop({ source }) {
        console.log({ entered: source });
      },
    });
  });

  return (
    <Card ref={ref}>
      <Block />
      <Block />
      <Block />
    </Card>
  );
};

function Block() {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    invariant(ref.current);
    return draggable({
      getInitialData() {
        return { id: "YOOO" };
      },
      element: ref.current,
      onDragStart({ location, source }) {
        console.log({ location });
        console.log({ source });
        setIsDragging(true);
      },
      onDrop({ location, source }) {
        setIsDragging(false);
      },
    });
  }, []);

  return (
    <Card ref={ref} opacity={isDragging ? 0.5 : 1}>
      <Group>
        <ThemeIcon>
          <IconForms />
        </ThemeIcon>

        <p>{String(isDragging)}</p>
      </Group>
    </Card>
  );
}

export default GroupNode;
