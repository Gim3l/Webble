import e from "dbschema/edgeql-js";

//TODO: Guard with access policy, and disable access policy on chat endpoint
export const getForm = e.params({ id: e.uuid }, (p) =>
  e.select(e.Form, () => ({
    filter_single: { id: p.id },
    published: true,
    structure: true,
    name: true,
    variables: { id: true, label: true },
  })),
);

export const listForms = e.select(e.Form, (form) => ({
  filter: e.op(form.user.id, "=", e.global.current_user.id),
  id: true,
  structure: true,
  published: true,
  updated_at: true,
  color: true,
  name: true,
  order_by: {
    expression: form.created_at,
    direction: "ASC",
  },
}));

export const createForm = e.params(
  { name: e.str, color: e.optional(e.str) },
  (p) =>
    e.insert(e.Form, {
      name: p.name,
      user: e.global.current_user,
      color: p.color,
      structure: {
        edges: [],
        nodes: [
          {
            id: "start",
            type: "start",
            data: {},
            position: { x: 500, y: 500 },
          },
        ],
      },
    }),
);

export const updateForm = e.params(
  { id: e.uuid, name: e.str, color: e.str },
  (p) =>
    e.update(e.Form, (form) => ({
      filter_single: e.op(
        e.op(e.global.current_user, "=", form.user),
        "and",
        e.op(form.id, "=", p.id),
      ),
      set: {
        name: p.name,
        color: p.color,
      },
    })),
);

export const updateFormStructure = e.params(
  { id: e.uuid, structure: e.json },
  (p) =>
    e.update(e.Form, (form) => ({
      filter_single: e.op(
        e.op(e.global.current_user, "=", form.user),
        "and",
        e.op(form.id, "=", p.id),
      ),
      set: { structure: p.structure },
    })),
);

export const deleteForm = e.params({ id: e.uuid }, (p) =>
  e.delete(e.Form, (form) => ({
    filter_single: e.op(
      e.op(e.global.current_user, "=", form.user),
      "and",
      e.op(form.id, "=", p.id),
    ),
  })),
);

export const createFormVariable = e.params(
  { formId: e.uuid, label: e.str },
  (p) =>
    e.insert(e.FormVariable, {
      form: e.select(e.Form, (form) => ({
        filter_single: e.op(
          e.op(p.formId, "=", form.id),
          "and",
          e.op(form.user, "=", e.global.current_user),
        ),
      })),
      label: p.label,
    }),
);

export const deleteFormVariable = e.params({ variableId: e.uuid }, (p) =>
  e.delete(e.FormVariable, (formVariable) => ({
    filter_single: e.op(
      e.op(formVariable.id, "=", p.variableId),
      "and",
      e.op(formVariable.form.user, "=", e.global.current_user),
    ),
  })),
);

export const toggleFormVisibility = e.params({ formId: e.uuid }, (p) =>
  e.update(e.Form, (form) => ({
    set: {
      published: e.op("not", form.published),
    },
    filter_single: e.op(
      e.op(form.id, "=", p.formId),
      "and",
      e.op(form.user, "=", e.global.current_user),
    ),
  })),
);

export const getFormSubmissions = e.params({ formId: e.uuid }, (p) =>
  e.select(e.ChatSession, (session) => {
    // const submissions = e.select(
    //   e.json_object_unpack(e.json_get(session.snapshot, "context", "values")),
    // );

    return {
      id: true,
      // submissions,
      form: true,
      filter:
        // e.op("exists", submissions),
        e.op(
          e.op(session.form.id, "=", p.formId),
          "and",
          e.op(session.form.user.id, "=", e.global.current_user.id),
        ),
      //   "and",
      //
    };
  }),
);
