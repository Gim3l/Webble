import createClientAuth, {
  type RemixAuthOptions,
} from "@edgedb/auth-remix/client";

export const options: RemixAuthOptions = {
  baseUrl: "http://localhost:5173",
  authCookieName: "webble-session",
};

const clientAuth = createClientAuth(options);

export default clientAuth;
