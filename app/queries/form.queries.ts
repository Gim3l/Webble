import e from "dbschema/edgeql-js";

export const getForm = e.params({ id: e.uuid }, (p) =>
  e.select(e.Form, () => ({
    filter_single: { id: p.id },
    structure: true,
    name: true,
  }))
);

export const listForms = e.select(e.Form, (form) => ({
  filter: e.op(form.user.id, "=", e.global.current_user.id),
  id: true,
  structure: true,
  name: true,
}));
