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
