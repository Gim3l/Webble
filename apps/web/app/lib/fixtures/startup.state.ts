import { ChatState } from "~/lib/chat.pipe";
import { Edge, ReactFlowJsonObject, Node } from "@xyflow/react";
import { EdgeData, GroupNodeData } from "@webble/elements";

const structure: ReactFlowJsonObject<Node<GroupNodeData>, Edge<EdgeData>> = {
  edges: [
    {
      id: "9XhqNTD4f2HoI1MPmi6hK",
      source: "start",
      target: "EbhlJUBpo7wqVZqrxh0Mg",
      selected: false,
      sourceHandle: "start",
    },
    {
      id: "G7QCglcAZPMoDz60Hr1o8",
      source: "EbhlJUBpo7wqVZqrxh0Mg",
      target: "YLKueTJSxW4u5fFL3aGMH",
      selected: false,
      sourceHandle: "EbhlJUBpo7wqVZqrxh0Mg",
    },
    {
      id: "xy-edge__EbhlJUBpo7wqVZqrxh0MgWKVfvmTaKE_77FoFjUAON-YLKueTJSxW4u5fFL3aGMH2XiA8XGXVyHzB7Au89UD9",
      type: "basic",
      style: {
        stroke: "var(--mantine-color-dark-3)",
        strokeWidth: 2,
      },
      source: "EbhlJUBpo7wqVZqrxh0Mg",
      target: "YLKueTJSxW4u5fFL3aGMH",
      selected: false,
      sourceHandle: "WKVfvmTaKE_77FoFjUAON",
      targetHandle: "2XiA8XGXVyHzB7Au89UD9",
    },
    {
      id: "xy-edge__EbhlJUBpo7wqVZqrxh0MgTo4GoZdFcQR-lmRMhdln--YLKueTJSxW4u5fFL3aGMH2XiA8XGXVyHzB7Au89UD9",
      type: "basic",
      style: {
        stroke: "var(--mantine-color-dark-3)",
        strokeWidth: 2,
      },
      source: "EbhlJUBpo7wqVZqrxh0Mg",
      target: "YLKueTJSxW4u5fFL3aGMH",
      selected: false,
      sourceHandle: "To4GoZdFcQR-lmRMhdln-",
      targetHandle: "2XiA8XGXVyHzB7Au89UD9",
    },
    {
      id: "xy-edge__YLKueTJSxW4u5fFL3aGMH2XiA8XGXVyHzB7Au89UD9-plFtni7NdWKoGInrdkNxXDJdLh_cogghiDxUXalrjR",
      type: "basic",
      style: {
        stroke: "var(--mantine-color-dark-3)",
        strokeWidth: 2,
      },
      source: "YLKueTJSxW4u5fFL3aGMH",
      target: "plFtni7NdWKoGInrdkNxX",
      selected: false,
      sourceHandle: "2XiA8XGXVyHzB7Au89UD9",
      targetHandle: "DJdLh_cogghiDxUXalrjR",
    },
    {
      id: "xy-edge__plFtni7NdWKoGInrdkNxXplFtni7NdWKoGInrdkNxX-vWFeyecITkVTRcThL-B5ivWFeyecITkVTRcThL-B5i",
      type: "basic",
      style: {
        stroke: "var(--mantine-color-dark-3)",
        strokeWidth: 2,
      },
      source: "plFtni7NdWKoGInrdkNxX",
      target: "vWFeyecITkVTRcThL-B5i",
      sourceHandle: "plFtni7NdWKoGInrdkNxX",
      targetHandle: "vWFeyecITkVTRcThL-B5i",
    },
    {
      id: "xy-edge__vWFeyecITkVTRcThL-B5ivWFeyecITkVTRcThL-B5i-_w1fmXyBqrQQNI7n5gKDo_w1fmXyBqrQQNI7n5gKDo",
      type: "basic",
      style: {
        stroke: "var(--mantine-color-dark-3)",
        strokeWidth: 2,
      },
      source: "vWFeyecITkVTRcThL-B5i",
      target: "_w1fmXyBqrQQNI7n5gKDo",
      sourceHandle: "vWFeyecITkVTRcThL-B5i",
      targetHandle: "_w1fmXyBqrQQNI7n5gKDo",
    },
  ],
  nodes: [
    {
      id: "EbhlJUBpo7wqVZqrxh0Mg",
      data: {
        name: "Group",
        elements: [
          {
            id: "_j1pgM7CBZSEG8oz5gPel",
            data: {
              text: "Hello!",
            },
            type: "text_bubble",
            groupId: "EbhlJUBpo7wqVZqrxh0Mg",
          },
          {
            id: "hKhowJsoOVMbhRqVXDm8U",
            data: {
              options: [
                {
                  id: "BSeXPcXFHf8E5IPVQmLvN",
                  label: "A",
                },
                {
                  id: "To4GoZdFcQR-lmRMhdln-",
                  label: "B",
                },
                {
                  id: "CsEwV93OLxn0zK44A50Kh",
                  label: "C",
                },
              ],
            },
            type: "choice_input",
            groupId: "EbhlJUBpo7wqVZqrxh0Mg",
          },
          {
            id: "WKVfvmTaKE_77FoFjUAON",
            data: {
              variable: "selection",
              buttonLabel: "Send",
              placeholder: "",
            },
            type: "text_input",
            groupId: "EbhlJUBpo7wqVZqrxh0Mg",
          },
        ],
      },
      type: "collection",
      dragging: false,
      measured: {
        width: 260,
        height: 417,
      },
      position: {
        x: 922.7815156719826,
        y: 405.6159682362752,
      },
      selected: false,
    },
    {
      id: "YLKueTJSxW4u5fFL3aGMH",
      data: {
        name: "Group",
        elements: [
          {
            id: "2XiA8XGXVyHzB7Au89UD9",
            data: {
              variable: "fa",
              buttonLabel: "Send",
              placeholder: "fdfdfdfdf",
            },
            type: "text_input",
            groupId: "YLKueTJSxW4u5fFL3aGMH",
          },
        ],
      },
      type: "collection",
      dragging: false,
      measured: {
        width: 260,
        height: 197,
      },
      position: {
        x: 1389.4609098283902,
        y: 538.0806491512822,
      },
      selected: false,
    },
    {
      id: "_w1fmXyBqrQQNI7n5gKDo",
      data: {
        name: "Group",
        elements: [
          {
            id: "oLFwgqFnh-Elad9OruOVU",
            data: {
              variable: "",
              buttonLabel: "Send",
              placeholder: "",
            },
            type: "text_input",
            groupId: "_w1fmXyBqrQQNI7n5gKDo",
          },
        ],
      },
      type: "collection",
      dragging: false,
      measured: {
        width: 260,
        height: 162,
      },
      position: {
        x: 2652.1113626730703,
        y: 456.16943379554453,
      },
      selected: false,
    },
    {
      id: "plFtni7NdWKoGInrdkNxX",
      data: {
        name: "Group #4",
        elements: [
          {
            id: "DJdLh_cogghiDxUXalrjR",
            data: {
              variable: "",
              buttonLabel: "Send",
              placeholder: "",
            },
            type: "email_input",
            groupId: "plFtni7NdWKoGInrdkNxX",
          },
          {
            id: "EwOlmhd8TLKR09BAZxUfI",
            data: {
              variable: "",
              buttonLabel: "Send",
              placeholder: "",
            },
            type: "number_input",
            groupId: "plFtni7NdWKoGInrdkNxX",
          },
        ],
      },
      type: "collection",
      dragging: false,
      measured: {
        width: 260,
        height: 211,
      },
      position: {
        x: 1820,
        y: 486,
      },
      selected: false,
    },
    {
      id: "vWFeyecITkVTRcThL-B5i",
      data: {
        name: "Group #5",
        elements: [
          {
            id: "sTUfnrJ0ABBQY3klJmPsG",
            data: {
              text: "Hello!",
            },
            type: "text_bubble",
            groupId: "vWFeyecITkVTRcThL-B5i",
          },
        ],
      },
      type: "collection",
      dragging: false,
      measured: {
        width: 260,
        height: 197,
      },
      position: {
        x: 2200.0770037989764,
        y: 540.2319721349951,
      },
      selected: false,
    },
  ],
  viewport: {
    x: -109.32488039075872,
    y: -48.15522353502138,
    zoom: 0.657927262514504,
  },
};

const inputAsFirstElStructure: ReactFlowJsonObject<
  Node<GroupNodeData>,
  Edge<EdgeData>
> = {
  edges: [
    {
      id: "9XhqNTD4f2HoI1MPmi6hK",
      source: "start",
      target: "EbhlJUBpo7wqVZqrxh0Mg",
      selected: false,
      sourceHandle: "start",
    },
    {
      id: "G7QCglcAZPMoDz60Hr1o8",
      source: "EbhlJUBpo7wqVZqrxh0Mg",
      target: "YLKueTJSxW4u5fFL3aGMH",
      selected: false,
      sourceHandle: "EbhlJUBpo7wqVZqrxh0Mg",
    },
    {
      id: "xy-edge__EbhlJUBpo7wqVZqrxh0MgWKVfvmTaKE_77FoFjUAON-YLKueTJSxW4u5fFL3aGMH2XiA8XGXVyHzB7Au89UD9",
      type: "basic",
      style: {
        stroke: "var(--mantine-color-dark-3)",
        strokeWidth: 2,
      },
      source: "EbhlJUBpo7wqVZqrxh0Mg",
      target: "YLKueTJSxW4u5fFL3aGMH",
      selected: false,
      sourceHandle: "WKVfvmTaKE_77FoFjUAON",
      targetHandle: "2XiA8XGXVyHzB7Au89UD9",
    },
    {
      id: "xy-edge__EbhlJUBpo7wqVZqrxh0MgTo4GoZdFcQR-lmRMhdln--YLKueTJSxW4u5fFL3aGMH2XiA8XGXVyHzB7Au89UD9",
      type: "basic",
      style: {
        stroke: "var(--mantine-color-dark-3)",
        strokeWidth: 2,
      },
      source: "EbhlJUBpo7wqVZqrxh0Mg",
      target: "YLKueTJSxW4u5fFL3aGMH",
      selected: false,
      sourceHandle: "To4GoZdFcQR-lmRMhdln-",
      targetHandle: "2XiA8XGXVyHzB7Au89UD9",
    },
    {
      id: "xy-edge__YLKueTJSxW4u5fFL3aGMH2XiA8XGXVyHzB7Au89UD9-plFtni7NdWKoGInrdkNxXDJdLh_cogghiDxUXalrjR",
      type: "basic",
      style: {
        stroke: "var(--mantine-color-dark-3)",
        strokeWidth: 2,
      },
      source: "YLKueTJSxW4u5fFL3aGMH",
      target: "plFtni7NdWKoGInrdkNxX",
      selected: false,
      sourceHandle: "2XiA8XGXVyHzB7Au89UD9",
      targetHandle: "DJdLh_cogghiDxUXalrjR",
    },
    {
      id: "xy-edge__plFtni7NdWKoGInrdkNxXplFtni7NdWKoGInrdkNxX-vWFeyecITkVTRcThL-B5ivWFeyecITkVTRcThL-B5i",
      type: "basic",
      style: {
        stroke: "var(--mantine-color-dark-3)",
        strokeWidth: 2,
      },
      source: "plFtni7NdWKoGInrdkNxX",
      target: "vWFeyecITkVTRcThL-B5i",
      sourceHandle: "plFtni7NdWKoGInrdkNxX",
      targetHandle: "vWFeyecITkVTRcThL-B5i",
    },
    {
      id: "xy-edge__vWFeyecITkVTRcThL-B5ivWFeyecITkVTRcThL-B5i-_w1fmXyBqrQQNI7n5gKDo_w1fmXyBqrQQNI7n5gKDo",
      type: "basic",
      style: {
        stroke: "var(--mantine-color-dark-3)",
        strokeWidth: 2,
      },
      source: "vWFeyecITkVTRcThL-B5i",
      target: "_w1fmXyBqrQQNI7n5gKDo",
      sourceHandle: "vWFeyecITkVTRcThL-B5i",
      targetHandle: "_w1fmXyBqrQQNI7n5gKDo",
    },
  ],
  nodes: [
    {
      id: "EbhlJUBpo7wqVZqrxh0Mg",
      data: {
        name: "Group",
        elements: [
          {
            id: "WKVfvmTaKE_77FoFjUAON",
            data: {
              variable: "selection",
              buttonLabel: "Send",
              placeholder: "",
            },
            type: "text_input",
            groupId: "EbhlJUBpo7wqVZqrxh0Mg",
          },
          {
            id: "_j1pgM7CBZSEG8oz5gPel",
            data: {
              text: "Hello!",
            },
            type: "text_bubble",
            groupId: "EbhlJUBpo7wqVZqrxh0Mg",
          },
          {
            id: "hKhowJsoOVMbhRqVXDm8U",
            data: {
              options: [
                {
                  id: "BSeXPcXFHf8E5IPVQmLvN",
                  label: "A",
                },
                {
                  id: "To4GoZdFcQR-lmRMhdln-",
                  label: "B",
                },
                {
                  id: "CsEwV93OLxn0zK44A50Kh",
                  label: "C",
                },
              ],
            },
            type: "choice_input",
            groupId: "EbhlJUBpo7wqVZqrxh0Mg",
          },
        ],
      },
      type: "collection",
      dragging: false,
      measured: {
        width: 260,
        height: 417,
      },
      position: {
        x: 922.7815156719826,
        y: 405.6159682362752,
      },
      selected: false,
    },
    {
      id: "YLKueTJSxW4u5fFL3aGMH",
      data: {
        name: "Group",
        elements: [
          {
            id: "2XiA8XGXVyHzB7Au89UD9",
            data: {
              variable: "fa",
              buttonLabel: "Send",
              placeholder: "fdfdfdfdf",
            },
            type: "text_input",
            groupId: "YLKueTJSxW4u5fFL3aGMH",
          },
        ],
      },
      type: "collection",
      dragging: false,
      measured: {
        width: 260,
        height: 197,
      },
      position: {
        x: 1389.4609098283902,
        y: 538.0806491512822,
      },
      selected: false,
    },
    {
      id: "_w1fmXyBqrQQNI7n5gKDo",
      data: {
        name: "Group",
        elements: [
          {
            id: "oLFwgqFnh-Elad9OruOVU",
            data: {
              variable: "",
              buttonLabel: "Send",
              placeholder: "",
            },
            type: "text_input",
            groupId: "_w1fmXyBqrQQNI7n5gKDo",
          },
        ],
      },
      type: "collection",
      dragging: false,
      measured: {
        width: 260,
        height: 162,
      },
      position: {
        x: 2652.1113626730703,
        y: 456.16943379554453,
      },
      selected: false,
    },
    {
      id: "plFtni7NdWKoGInrdkNxX",
      data: {
        name: "Group #4",
        elements: [
          {
            id: "DJdLh_cogghiDxUXalrjR",
            data: {
              variable: "",
              buttonLabel: "Send",
              placeholder: "",
            },
            type: "email_input",
            groupId: "plFtni7NdWKoGInrdkNxX",
          },
          {
            id: "EwOlmhd8TLKR09BAZxUfI",
            data: {
              variable: "",
              buttonLabel: "Send",
              placeholder: "",
            },
            type: "number_input",
            groupId: "plFtni7NdWKoGInrdkNxX",
          },
        ],
      },
      type: "collection",
      dragging: false,
      measured: {
        width: 260,
        height: 211,
      },
      position: {
        x: 1820,
        y: 486,
      },
      selected: false,
    },
    {
      id: "vWFeyecITkVTRcThL-B5i",
      data: {
        name: "Group #5",
        elements: [
          {
            id: "sTUfnrJ0ABBQY3klJmPsG",
            data: {
              text: "Hello!",
            },
            type: "text_bubble",
            groupId: "vWFeyecITkVTRcThL-B5i",
          },
        ],
      },
      type: "collection",
      dragging: false,
      measured: {
        width: 260,
        height: 197,
      },
      position: {
        x: 2200.0770037989764,
        y: 540.2319721349951,
      },
      selected: false,
    },
  ],
  viewport: {
    x: -109.32488039075872,
    y: -48.15522353502138,
    zoom: 0.657927262514504,
  },
};

export const StartupChatState: ChatState = {
  groups: structure.nodes.filter((node) => node.id !== "start"),
  captures: [],
  edges: structure.edges,
  group: null,
  initialLastCapturedEl: null,
  lastMessage: "",
  lastCapturedEl: null,
  values: {},
};

export const StartupChatStateInputFirst: ChatState = {
  groups: inputAsFirstElStructure.nodes.filter((node) => node.id !== "start"),
  captures: [],
  edges: inputAsFirstElStructure.edges,
  group: null,
  initialLastCapturedEl: null,
  lastMessage: "",
  lastCapturedEl: null,
  values: {},
};
