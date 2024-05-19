import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

const { loader: loaderFn } = auth.createAuthRouteHandlers({
  async onOAuthCallback({ error, tokenData, provider, isSignUp }) {
    return redirect("/");
  },
  async onSignout() {
    return redirect("/");
  },
});

export function loader(args: LoaderFunctionArgs) {
  return loaderFn(args);
}
