import { Box, Card } from "@mantine/core";
import { NodeData, GroupElementTypes } from "./store";

import { DragOverlay as DnDDragOverlay } from "@dnd-kit/core";
import { RenderGroupElement } from "./GroupNode";

function DragOverlay({
	element,
}: {
	element?: NodeData | null;
}) {
	return (
		<Box w={200}>
			<DnDDragOverlay>
				{element?.id && element?.type ? (
					<RenderGroupElement {...element} groupId={""} />
				) : null}
			</DnDDragOverlay>
		</Box>
	);
}

export default DragOverlay;
