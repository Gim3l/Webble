import e from "dbschema/edgeql-js";

export const getCurrentUser = e.select(e.global.current_user);

export const createUserProfile = e.insert(e.User, {});
