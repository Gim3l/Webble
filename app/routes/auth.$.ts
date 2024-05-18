import { redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export const { loader } = auth.createAuthRouteHandlers({
  async onOAuthCallback({ error, tokenData, provider, isSignUp }) {
    return redirect("/");
  },
  async onSignout() {
    return redirect("/");
  },
});
