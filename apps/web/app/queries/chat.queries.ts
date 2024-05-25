import e from "dbschema/edgeql-js";

export const createChatSession = e.params(
  { formId: e.uuid, last_group: e.json },
  (p) =>
    e.insert(e.ChatSession, {
      values: {},
      form: e.select(e.Form, () => ({
        filter_single: { id: p.formId },
      })),
    }),
);

export const updateChatSession = e.params(
  { sessionId: e.uuid, values: e.json },
  (p) =>
    e.update(e.ChatSession, () => ({
      filter_single: { id: p.sessionId },
      set: {
        values: p.values,
      },
    })),
);

export const getChatSession = e.params({ id: e.uuid }, (p) =>
  e.select(e.ChatSession, (session) => ({
    filter_single: { id: p.id },
    id: true,
    values: true,
    history: (history) => ({
      captures: true,
      order_by: {
        direction: e.DESC,
        expression: history.created_at,
      },
    }),
  })),
);

export const addToChatHistory = e.params(
  { captures: e.json, message: e.str, session: e.uuid },
  (p) =>
    e.insert(e.ChatHistory, {
      captures: p.captures,
      message: p.message,
      session: e.select(e.ChatSession, () => ({
        filter_single: { id: p.session },
      })),
    }),
);

export const getFormChatSessions = e.params({ formId: e.uuid }, (p) =>
  e.select(e.ChatSession, (session) => ({
    id: true,
    values: true,
    filter: e.op(
      e.op(p.formId, "=", session.form.id),
      "and",
      e.op(session.form.user, "=", e.global.current_user),
    ),
  })),
);
