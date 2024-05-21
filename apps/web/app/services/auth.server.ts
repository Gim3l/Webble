import createServerAuth from "@edgedb/auth-remix/server";
import { createClient } from "edgedb";
import { options } from "./auth";

export const authClient = createClient({
  //Note: when developing locally you will need to set tls  security to insecure, because the dev server uses  self-signed certificates which will cause api calls with the fetch api to fail.
  tlsSecurity:
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
      ? "strict"
      : "insecure",
});

export const auth = createServerAuth(authClient, options);
