import {
  Card,
  useMantineTheme,
  useMantineColorScheme,
  Button,
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
  ThemeIcon,
  List,
  rem,
  Divider,
  Input,
  ScrollArea,
} from "@mantine/core";
import {
  IconArrowBack,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconLayersIntersect2,
  IconMaximize,
  IconMinimize,
  IconRepeat,
  IconTrash,
  IconVariable,
  IconVariablePlus,
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
import {
  createFormVariable,
  deleteFormVariable,
  getForm,
} from "~/queries/form.queries";
import { dbClient } from "~/lib/db";
import { useDebouncedCallback, useDisclosure, useToggle } from "@mantine/hooks";
import { auth } from "~/services/auth.server";
import { ConstraintViolationError } from "edgedb";
import { useForm } from "@mantine/form";
import DefaultEdge from "~/components/collect/elements/DefaultEdge";
import { ElementTypes } from "@webble/elements";
import TextBubbleElement from "~/components/collect/elements/TextBubbleElement";

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

  if (_action === "createVariable") {
    const label = formData.get("label") as string;
    try {
      await createFormVariable.run(client, {
        label,
        formId: params.formId as string,
      });
      return json({ success: true });
    } catch (err) {
      if (err instanceof ConstraintViolationError) {
        return json({ success: false, name: err.name, code: err.code });
      }
      return err;
    }
  }

  if (_action === "deleteVariable") {
    const variableId = formData.get("variableId") as string;
    await deleteFormVariable.run(client, { variableId });
    return json({ success: true });
  }

  return json({});
}

export default function CollectPage() {
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { form } = useLoaderData<typeof loader>();

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
  const colorScheme = useMantineColorScheme();
  const { nodes, edges } = useSnapshot(graphStore);
  // const { nodes, edges, allowNodesDrag } = useGraphState();
  const connectingNodeId = useRef(null);
  const connectingHandleId = useRef(null);
  const reactFlow = useReactFlow();

  const nodeTypes = useMemo(() => {
    const elementNodesTypes = {
      start: StartNode,
      collection: CollectionNode,
      email_input: EmailInputElement,
      text_input: InputElement,
      number_input: NumberInputElement,
      choice_input: ChoiceInputElement,
      text_bubble: TextBubbleElement,
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
          // draggable: false,
        } satisfies Node;

        setNodes([...nodes, newNode]);

        const newEdge: Edge = {
          id,
          source: connectingNodeId.current,
          target: id,
        };

        if (connectingHandleId.current) {
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
    ],
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
    console.log({ viewport });
  }, []);

  const saveFetcher = useFetcher();
  const params = useParams();

  const saveGraphStructure = useDebouncedCallback(
    async (rfInstance: ReactFlowInstance) => {
      const structure = JSON.stringify(rfInstance.toObject());

      saveFetcher.submit(
        { _action: "saveStructure", structure },
        {
          method: "POST",
          action: `/form/save/${params.formId}`,
        },
      );
    },
    1000,
  );

  // const onSelectionChange = useCallback((selection) => {
  //   // console.log("yo")
  //   react(selection.nodes);
  // }, []);

  // const onNodeDragStart = useCallback(() => {
  //   setIsDraggingNode(true);
  // }, []);
  //
  // const onNodeDragStop = useCallback(() => {
  //   setIsDraggingNode(false);
  // }, []);

  return (
    <>
      <ReactFlow
        // nodeDragThreshold={5}
        // selectNodesOnDrag={false}
        nodeTypes={nodeTypes as unknown as any}
        edgeTypes={{ smoothstep: DefaultEdge }}
        nodes={nodes}
        edges={edges}
        // onSelectionChange={onSelectionChange}
        // onNodeDragStart={onNodeDragStart}
        // autoPanOnNodeDrag
        // onNodeDragStop={onNodeDragStop}
        colorMode={
          colorScheme.colorScheme === "auto"
            ? "system"
            : colorScheme.colorScheme
        }
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
        onSelectionContextMenu={(e) => {
          const selectionRect = document
            .querySelector(".react-flow__nodesselection-rect")
            ?.getBoundingClientRect();

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
        {/*<MiniMap position={"bottom-right"} nodeStrokeWidth={3} />*/}
        <Panel position={"top-right"}>
          <Chat></Chat>
        </Panel>
        <Panel position={"bottom-right"}>
          <NodeConfig />
        </Panel>
        <Panel position={"bottom-left"}>
          <Variables />
        </Panel>
        <Panel position={"top-left"}>
          <TopLeftPanel saveFetcher={saveFetcher} />
        </Panel>
        {/*<Panel position={"bottom-right"}>*/}
        {/*<DebugPanel />*/}
        {/*</Panel>*/}
        <Background
          color={scheme.colorScheme === "dark" ? "#fff" : "#ccc"}
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </>
  );
}

export function Chat() {
  const params = useParams();
  const [chatboxKey, setChatboxKey] = useState();
  const chatboxRef = useRef<HTMLElement>(null);
  const reactFlow = useReactFlow();

  useEffect(() => {
    if (chatboxRef.current)
      chatboxRef.current.addEventListener("targetChange", (e: unknown) => {
        const nodes = reactFlow.getNodes().map((node) => {
          if (node.id === e.detail) return { ...node, selected: true };
          return { ...node, selected: false };
        });
        reactFlow.setNodes(nodes);

        reactFlow.fitView({
          nodes: [{ id: e.detail }],
          duration: 500,
          maxZoom: 1,
        });
      });
  }, [chatboxRef.current]);

  return (
    <Card w={400} h={500}>
      <Group align={"center"} justify={"space-between"} mb={"sm"}>
        <div>
          <Title order={4}>Chat</Title>
        </div>

        <Button
          size={"compact-sm"}
          leftSection={<IconRepeat size={16} />}
          onClick={() => {
            (chatboxRef.current as unknown)?.reset();
          }}
        >
          Restart
        </Button>
      </Group>

      <Divider />

      <webble-chatbox
        ref={chatboxRef}
        key={chatboxKey}
        formId={params.formId}
        style={{ height: "100%", borderRadius: 8, overflow: "auto" }}
      />
    </Card>
  );
}

export function NodeConfig() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<{ success: boolean }>();
  const form = useForm({ initialValues: { label: "" } });
  const [opened, { toggle }] = useDisclosure(true);

  useEffect(() => {
    if (fetcher.data?.success) form.reset();
  }, [fetcher.data]);
  return (
    <Card w={300} withBorder>
      <Group justify={"space-between"} align={"start"}>
        <Title order={4}>Edit Element</Title>
        <Tooltip label={opened ? "Minimize" : "Maximize"}>
          <ActionIcon size={"xs"} onClick={toggle}>
            {opened ? <IconMinimize /> : <IconMaximize />}
          </ActionIcon>
        </Tooltip>
      </Group>

      <Divider />

      <Collapse in={opened}>
        <div className={"#webble-element-config"}></div>
      </Collapse>
    </Card>
  );
}

export function Variables() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<{ success: boolean }>();
  const form = useForm({ initialValues: { label: "" } });
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    if (fetcher.data?.success) form.reset();
  }, [fetcher.data]);
  return (
    <Card w={300} withBorder>
      <Group justify={"space-between"} align={"start"}>
        <Title order={4}>Variables</Title>
        <Tooltip label={opened ? "Minimize" : "Maximize"}>
          <ActionIcon size={"xs"} onClick={toggle}>
            {opened ? <IconMinimize /> : <IconMaximize />}
          </ActionIcon>
        </Tooltip>
      </Group>

      <Divider />

      <Collapse in={opened}>
        <List
          spacing="xs"
          size="sm"
          mt={"lg"}
          center
          icon={
            <ThemeIcon variant={"light"} size={24} radius="sm">
              <IconVariable style={{ width: rem(16), height: rem(16) }} />
            </ThemeIcon>
          }
        >
          <form
            onReset={form.onReset}
            onSubmit={form.onSubmit(({ label }) => {
              fetcher.submit(
                { _action: "createVariable", label },
                { method: "POST" },
              );
            })}
          >
            <Group mb={"lg"}>
              <Input
                name="label"
                {...form.getInputProps("label")}
                minLength={1}
                placeholder={"Add a new variable"}
                size={"xs"}
              />
              <Button
                name={"_action"}
                type={"submit"}
                value={"createVariable"}
                leftSection={
                  <IconVariablePlus
                    style={{ width: rem(18), height: rem(18) }}
                  />
                }
                loading={fetcher.state !== "idle"}
                size={"xs"}
              >
                Add
              </Button>
            </Group>
          </form>

          <ScrollArea h={200}>
            {loaderData.form?.variables.map((variable) => (
              <List.Item key={variable.id}>
                <Flex align={"center"} justify={"space-between"}>
                  <Text fz={14} w={140}>
                    {variable.label}
                  </Text>
                  <DeleteVariableAction id={variable.id} />
                </Flex>
              </List.Item>
            ))}
          </ScrollArea>
        </List>
      </Collapse>
    </Card>
  );
}

function DeleteVariableAction({ id }: { id: string }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method={"POST"}>
      <input hidden readOnly value={id} name={"variableId"} />
      <ActionIcon
        type={"submit"}
        name={"_action"}
        value={"deleteVariable"}
        loading={fetcher.state !== "idle"}
        size={"sm"}
        color={"red"}
      >
        <IconTrash style={{ width: rem(16), height: rem(16) }} />
      </ActionIcon>
    </fetcher.Form>
  );
}

function TopLeftPanel({ saveFetcher }: { saveFetcher: Fetcher }) {
  const loaderData = useLoaderData<typeof loader>();
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
                // onClick={() => undo()}
              >
                <IconArrowBackUp />
              </ActionIcon>
            </Tooltip>

            <Tooltip label={"Redo"}>
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
          <Text fz={"xs"} c="gray">
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
                    { action: `/chat/${params.formId}`, method: "POST" },
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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "webble-chatbox": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { formId: string | undefined };
    }
  }
}
