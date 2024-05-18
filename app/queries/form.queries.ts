import e from "dbschema/edgeql-js";

export const getForm = e.params({ id: e.uuid }, (p) =>
  e.select(e.Form, () => ({
    filter_single: { id: p.id },
    structure: true,
    name: true,
  }))
);
