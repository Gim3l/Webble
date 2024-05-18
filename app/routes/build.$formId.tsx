import {
  Card,
  useMantineTheme,
  useMantineColorScheme,
  Button,
  Textarea,
  TextInput,
  Group,
  Text,
  Title,
  Flex,
  ActionIcon,
  Tooltip,
  Loader,
  Collapse,
  JsonInput,
} from "@mantine/core";
import {
  IconArrowBack,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconLayersIntersect2,
} from "@tabler/icons-react";
import React, {
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ReactFlow,
  Node,
  Background,
  BackgroundVariant,
  Panel,
  ReactFlowInstance,
  Edge,
  ReactFlowProvider,
  useReactFlow,
  Controls,
  useOnSelectionChange,
  OnConnectStart,
  OnConnectEnd,
  Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "~/styles/global.css";
import { useDroppable } from "@dnd-kit/core";
import InputElement from "~/components/collect/elements/InputElement";
import { nanoid } from "nanoid";
import NumberInputElement from "~/components/collect/elements/NumberInputElement";
import EmailInputElement from "~/components/collect/elements/EmailInputElement";
import { NewElementNode } from "~/components/collect/NewElementNode";
import {
  ElementNode,
  ElementTypes,
} from "~/components/collect/elements/config";
import StartNode from "~/components/collect/elements/StartNode";
import { useContextMenu } from "mantine-contextmenu";
import { CollectionNode } from "~/components/collect/GroupNode";
import {
  autoLayout,
  createCollectionNode,
  graphStore,
  onConnect,
  onEdgesChange,
  onNodesChange,
  setEdges,
  setNodes,
  setSelectedNodes,
} from "~/components/collect/store";
import ChoiceInputElement from "~/components/collect/elements/ChoiceInputElement";
import { useSnapshot } from "valtio/react";
import {
  Fetcher,
  Link,
  useFetcher,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { getForm, updateFormStructure } from "~/queries/form.queries";
import { dbClient } from "~/lib/db";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { auth } from "~/services/auth.server";

// const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges(2, 1);

export async function loader({ params }: LoaderFunctionArgs) {
  const formId = params.formId as string;

  const form = await getForm.run(dbClient, { id: formId });

  return json({ form });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const _action = formData.get("_action");
  const session = auth.getSession(request);
  const client = session.client;

  if (_action === "saveStructure") {
    try {
      const structure = JSON.parse(formData.get("structure") as string);
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      await updateFormStructure.run(client, {
        id: params.formId as string,
        structure,
      });
    } catch (err) {
      return json({ success: false, error: "Unable to save changes" });
    }

    return json({ success: true });
  }

  return json({});
}

export default function CollectPage() {
  const ref = useRef<HTMLDivElement>();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { form } = useLoaderData<typeof loader>();
  const { undo, redo } = useSnapshot(graphStore);

  return (
    <div className={"webble"} style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <Graph
          initialNodes={form.structure["nodes"]}
          initialEdges={form.structure["edges"]}
          rfInstance={rfInstance}
          viewport={form.structure["viewport"]}
          setRfInstance={setRfInstance}
        />
      </ReactFlowProvider>
    </div>
  );
}

function Graph({
  setRfInstance,
  initialNodes,
  initialEdges,
  viewport,
}: {
  rfInstance: ReactFlowInstance | null;
  setRfInstance: React.Dispatch<SetStateAction<ReactFlowInstance | null>>;
  initialNodes: Node[];
  initialEdges: Edge[];
  viewport: Viewport;
}) {
  const scheme = useMantineColorScheme();
  const theme = useMantineTheme();
  const { nodes, edges } = useSnapshot(graphStore);
  // const { nodes, edges, allowNodesDrag } = useGraphState();
  const connectingNodeId = useRef(null);
  const connectingHandleId = useRef(null);
  const reactFlow = useReactFlow();

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      console.log({ nodes });
      setSelectedNodes(nodes);
    },
  });

  const nodeTypes = useMemo(() => {
    const elementNodesTypes = {
      start: StartNode,
      collection: CollectionNode,
      email_input: EmailInputElement,
      text_input: InputElement,
      number_input: NumberInputElement,
      choice_input: ChoiceInputElement,
    } satisfies Record<
      ElementTypes | "start" | "collection",
      (props: any) => ReactNode
    >;

    return {
      ...elementNodesTypes,
      new: NewElementNode,
    };
  }, []);

  const { screenToFlowPosition } = useReactFlow();

  const onConnectStart: OnConnectStart = useCallback((_, data) => {
    connectingNodeId.current = data.nodeId;
    connectingHandleId.current = data.handleId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      console.log({ event });
      if (!event.target) return;
      if (!connectingNodeId.current) return;

      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = nanoid();
        const newNode = {
          id,
          type: "new",

          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { label: `Node ${id}` },
          // origin: [0.5, 0.0],
          draggable: false,
        } satisfies Node;

        setNodes([...nodes, newNode]);

        const newEdge: Edge = {
          id,
          source: connectingNodeId.current,
          target: id,
        };

        if (connectingHandleId.current) {
          console.log({ connectingHandleId });
          newEdge.sourceHandle = connectingHandleId.current;
        }

        setEdges([...edges, newEdge]);
      }
    },
    [
      screenToFlowPosition,
      nodes,
      edges,
      connectingHandleId.current,
      connectingNodeId.current,
    ]
  );

  const onNodeContextMenu = useCallback((event, _node: Node) => {
    // Prevent native context menu from showing
    event.preventDefault();
  }, []);
  const { showContextMenu } = useContextMenu();

  useEffect(() => {
    if (initialNodes) setNodes(initialNodes);
    if (initialEdges) setEdges(initialEdges);
    if (viewport) reactFlow.setViewport(viewport);
  }, []);

  const saveFetcher = useFetcher();

  const saveGraphStructure = useDebouncedCallback(
    async (rfInstance: ReactFlowInstance) => {
      console.log("SAVING....");
      const structure = JSON.stringify(rfInstance.toObject());

      saveFetcher.submit(
        { _action: "saveStructure", structure },
        {
          method: "POST",
        }
      );
    },
    1000
  );

  return (
    <ReactFlow
      nodeTypes={nodeTypes as unknown as any}
      nodes={nodes}
      edges={edges}
      onNodesChange={(changes) => {
        onNodesChange(changes);
        saveGraphStructure(reactFlow);
      }}
      onMoveEnd={() => {
        saveGraphStructure(reactFlow);
      }}
      onEdgesChange={(changes) => {
        onEdgesChange(changes);
        saveGraphStructure(reactFlow);
      }}
      onConnect={(connection) => {
        connectingNodeId.current = null;
        connectingHandleId.current = null;
        onConnect(connection);
      }}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      onInit={setRfInstance}
      preventScrolling
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={{ type: "smoothstep" }}
      onSelectionEnd={(selectionEnd) => {
        console.log({ selectionEnd });
      }}
      onSelectionContextMenu={(e) => {
        const selectionRect = document
          .querySelector(".react-flow__nodesselection-rect")
          ?.getBoundingClientRect();

        console.log({ selectionRect });

        showContextMenu([
          {
            key: "delete",
            icon: <IconLayersIntersect2 size={16} />,
            title: "Create Group",
            onClick: () =>
              selectionRect ? createCollectionNode({}) : undefined,
          },
        ])(e);
      }}
      onNodeContextMenu={onNodeContextMenu}
      style={{
        background:
          scheme.colorScheme === "dark" ? theme.colors.dark[5] : "#fff",
      }}
    >
      <Controls />

      <Panel position={"top-right"}>
        <TopRightPanel />
      </Panel>
      <Panel position={"top-left"}>
        <TopLeftPanel saveFetcher={saveFetcher} />
      </Panel>
      <Panel position={"bottom-right"}>
        <DebugPanel />
      </Panel>
      <Background
        color={scheme.colorScheme === "dark" ? "#fff" : "#ccc"}
        variant={BackgroundVariant.Dots}
      />
    </ReactFlow>
  );
}

export function TopRightPanel() {
  return (
    <Card w={300} withBorder>
      <Title order={4}>Variables</Title>
    </Card>
  );
}

function TopLeftPanel({ saveFetcher }: { saveFetcher: Fetcher }) {
  const loaderData = useLoaderData<typeof loader>();
  const { undo, redo } = useSnapshot(graphStore);
  return (
    <>
      <Card>
        <Flex gap={"lg"}>
          <Group>
            <Button
              size={"compact-sm"}
              leftSection={<IconArrowBack />}
              component={Link}
              to={"/dashboard"}
              variant={"light"}
            >
              Back
            </Button>
            <Tooltip label={"Undo"}>
              <ActionIcon
                // disabled={!canUndo}
                size={"sm"}
                variant={"light"}
                onClick={() => undo()}
              >
                <IconArrowBackUp />
              </ActionIcon>
            </Tooltip>

            <Tooltip label={"Redo"} onClick={() => redo()}>
              <ActionIcon size={"sm"} variant={"light"}>
                <IconArrowForwardUp />
              </ActionIcon>
            </Tooltip>
          </Group>
          <Title order={4}>{loaderData.form?.name}</Title>
        </Flex>
      </Card>

      {saveFetcher.state !== "idle" && (
        <Flex mt={"sm"} align={"center"} gap={"xs"}>
          <Loader type={"dots"} size={"xs"} color={"gray"}></Loader>
          <Text fz={"xs"} c="dimmed">
            Saving...
          </Text>
        </Flex>
      )}
    </>
  );
}

function DebugPanel() {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  const rf = useReactFlow();
  const fetcher = useFetcher<{
    nextElementId: string;
    sessionId: string;
    input: Pick<ElementNode, "id" | "type" | "data">;
  }>();
  const { nodes, edges, selectedNodes } = useSnapshot(graphStore);
  const [sessionId, setSessionId] = useState("");
  const params = useParams();

  useEffect(() => {
    setSessionId(fetcher?.data?.sessionId || "");
    const node = nodes?.find((n) => n.id === fetcher?.data?.nextElementId);
    // console.log({ node });
    if (node) setSelectedNodes([node]);
  }, [fetcher?.data?.sessionId]);

  useEffect(() => {
    const node = nodes?.find((n) => n.id === fetcher?.data?.nextElementId);
    if (node) setSelectedNodes([node]);

    rf.fitView({
      nodes: [{ id: node?.id }],
      duration: 500,
      maxZoom: 1,
    });
  }, [fetcher?.data?.nextElementId]);

  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Card styles={{ root: { overflow: "visible" } }} ref={setNodeRef} w={400}>
      <Collapse in={opened}>
        <JsonInput
          resize="vertical"
          rows={8}
          minRows={8}
          formatOnBlur
          value={JSON.stringify(rf.toObject(), null, 4)}
        ></JsonInput>
        <fetcher.Form method={"POST"} action={`/chat/${params.formId}`}>
          <input hidden readOnly name={"sessionId"} value={sessionId} />
          <TextInput label={"Message"} name={"message"} my={"sm"}></TextInput>
          <Flex justify={"space-between"}>
            <Group>
              <Button type={"submit"}>Travel</Button>
              <Button
                color={"teal"}
                onClick={() =>
                  fetcher.submit(
                    {
                      message: "",
                      config: JSON.stringify({ elements: nodes, edges }),
                    },
                    { action: `/chat/${params.formId}`, method: "POST" }
                  )
                }
              >
                Restart
              </Button>
            </Group>

            <Button onClick={() => autoLayout()}>AutoLayout</Button>
          </Flex>
        </fetcher.Form>
        <Text>Current Node Id: {selectedNodes?.[0]?.id}</Text>
      </Collapse>
      <Button onClick={() => toggle()}>Toggle Debug</Button>
    </Card>
  );
}
