import e from "../../dbschema/edgeql-js";

export const createImage = e.params({ key: e.str, formId: e.uuid }, (p) =>
  e.insert(e.Image, {
    key: p.key,
    form: e.select(e.Form, () => ({ filter_single: { id: p.formId } })),
  }),
);
