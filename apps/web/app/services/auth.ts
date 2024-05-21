import createClientAuth, {
  type RemixAuthOptions,
} from "@edgedb/auth-remix/client";

export const options: RemixAuthOptions = {
  baseUrl: process.env.BASE_URL || "",
  authCookieName: "webble-session",
};

const clientAuth = createClientAuth(options);

export default clientAuth;
