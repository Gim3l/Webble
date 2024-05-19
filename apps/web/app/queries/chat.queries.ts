import e from "dbschema/edgeql-js";

export const createChatSession = e.params(
  { snapshot: e.json, formId: e.uuid },
  (p) =>
    e.insert(e.ChatSession, {
      snapshot: p.snapshot,
      form: e.select(e.Form, () => ({ filter_single: { id: p.formId } })),
    })
);

export const updateChatSession = e.params(
  { snapshot: e.json, sessionId: e.uuid },
  (p) =>
    e.update(e.ChatSession, () => ({
      filter_single: { id: p.sessionId },
      set: {
        snapshot: p.snapshot,
      },
    }))
);

export const getChatSession = e.params({ id: e.uuid }, (p) =>
  e.select(e.ChatSession, () => ({
    filter_single: { id: p.id },
    id: true,
    snapshot: true,
  }))
);
