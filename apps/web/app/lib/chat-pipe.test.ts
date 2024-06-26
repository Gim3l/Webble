import { describe, expect, it } from "vitest";
import { Effect, pipe } from "effect";
import {
  startup,
  saveInput,
  jumpIfNecessary,
  captureNextGroupElements,
} from "~/lib/chat.pipe";
import {
  StartupChatState,
  StartupChatStateInputFirst,
} from "~/lib/fixtures/startup.state";

describe("test startup function", () => {
  it("startup sets the initial group", async () => {
    const result = await Effect.runPromise(
      pipe(
        Effect.succeed(StartupChatState),
        Effect.flatMap((state) => startup(state)),
      ),
    );

    const startEdge = StartupChatState.edges.find(
      (edge) => edge.source === "start",
    );
    console.log({ startEdge });
    expect(result.group).not.toBeFalsy();
    expect(result.group?.id).toBe(startEdge?.target);
  });

  it("startup sets the last captured element", async () => {
    const result = await Effect.runPromise(
      pipe(
        Effect.succeed(StartupChatState),
        Effect.flatMap((state) => startup(state)),
      ),
    );

    expect(result.lastCapturedEl).not.toBeFalsy();
    expect(result.lastCapturedEl?.groupId).toBe(result.group?.id);
  });
});

describe("test saveInput", () => {
  it("saveInput sets the variable value", async () => {
    const startGroupId = "EbhlJUBpo7wqVZqrxh0Mg";
    // this element is the input element displayed on the chat ui
    const lastElementId = "WKVfvmTaKE_77FoFjUAON";
    const variableName = "selection";
    const state = { ...StartupChatState };
    state.group =
      state.groups.find((group) => group.id === startGroupId) || null;
    state.lastCapturedEl =
      state.group?.data?.elements?.find((el) => el.id === lastElementId) ||
      null;
    state.lastMessage = "Yes";

    const result = await Effect.runPromise(
      pipe(
        Effect.succeed(state),
        Effect.flatMap((state) => startup(state)),
        Effect.flatMap((state) => saveInput(state)),
      ),
    );

    expect(result.group?.id).toBe(startGroupId);
    expect(result.values?.[variableName]?.value).toBe(state.lastMessage);
  });
});

describe("capture next group element", () => {
  it("input returns as first group element", async () => {
    const startGroupId = "EbhlJUBpo7wqVZqrxh0Mg";
    const state = { ...StartupChatStateInputFirst };
    // this element is the input element displayed on the chat ui
    state.group =
      state.groups.find((group) => group.id === startGroupId) || null;

    const result = await Effect.runPromise(
      pipe(
        Effect.succeed(StartupChatStateInputFirst),
        Effect.flatMap((state) => startup(state)),
        Effect.flatMap((state) => saveInput(state)),
        Effect.flatMap((state) => jumpIfNecessary(state)),
        Effect.flatMap((state) => captureNextGroupElements(state)),
      ),
    );

    expect(result.captures?.length).toBe(1);
  });

  it("can jump from one input to another input", async () => {
    const startGroupId = "EbhlJUBpo7wqVZqrxh0Mg";
    // this element is the input element displayed on the chat ui
    const state = { ...StartupChatStateInputFirst };
    state.group =
      state.groups.find((group) => group.id === startGroupId) || null;

    state.lastCapturedEl = state.group?.data?.elements[0] || null;

    expect(state.lastCapturedEl).not.toBe(null);

    const result = await Effect.runPromise(
      pipe(
        Effect.succeed(state),
        Effect.flatMap((state) => startup(state)),
        Effect.flatMap((state) => saveInput(state)),
        Effect.flatMap((state) => jumpIfNecessary(state)),
        Effect.flatMap((state) => captureNextGroupElements(state)),
      ),
    );

    expect(result.captures?.length).toBe(1);
  });
});
