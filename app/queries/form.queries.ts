import e from "dbschema/edgeql-js";

export const getForm = e.params({ id: e.uuid }, (p) =>
  e.select(e.Form, () => ({
    filter_single: { id: p.id },
    structure: true,
    name: true,
    variables: { id: true, label: true },
  }))
);

export const listForms = e.select(e.Form, (form) => ({
  filter: e.op(form.user.id, "=", e.global.current_user.id),
  id: true,
  structure: true,
  name: true,
}));

export const createForm = e.params({ name: e.str }, (p) =>
  e.insert(e.Form, {
    name: p.name,
    user: e.global.current_user,
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
  })
);

export const updateFormStructure = e.params(
  { id: e.uuid, structure: e.json },
  (p) =>
    e.update(e.Form, (form) => ({
      filter_single: e.op(
        e.op(e.global.current_user, "=", form.user),
        "and",
        e.op(form.id, "=", p.id)
      ),
      set: { structure: p.structure },
    }))
);

export const createFormVariable = e.params(
  { formId: e.uuid, label: e.str },
  (p) =>
    e.insert(e.FormVariable, {
      form: e.select(e.Form, (form) => ({
        filter_single: e.op(
          e.op(p.formId, "=", form.id),
          "and",
          e.op(form.user, "=", e.global.current_user)
        ),
      })),
      label: p.label,
    })
);

export const deleteFormVariable = e.params({ variableId: e.uuid }, (p) =>
  e.delete(e.FormVariable, (formVariable) => ({
    filter_single: e.op(
      e.op(formVariable.id, "=", p.variableId),
      "and",
      e.op(formVariable.form.user, "=", e.global.current_user)
    ),
  }))
);
