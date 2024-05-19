import { useDraggable } from "@dnd-kit/core";
import { Paper, useMantineTheme } from "@mantine/core";
import classes from "./DragSkeleton.module.css";

export const draggableStyle = (
	transform: ReturnType<typeof useDraggable>["transform"],
) =>
	transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
				zIndex: 999,
		  }
		: undefined;

export function DragSkeleton() {
	const theme = useMantineTheme();

	return (
		<div className="nodrag">
			<Paper
				withBorder
				classNames={{ root: classes.root }}
				shadow="0"
				h={40}
			></Paper>
		</div>
	);
}
