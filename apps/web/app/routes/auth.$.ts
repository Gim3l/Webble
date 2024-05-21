import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

const { loader: loaderFn } = auth.createAuthRouteHandlers({
  async onOAuthCallback({ error, tokenData, provider, isSignUp }) {
    if (isSignUp) {
      console.log({ provider });
    }

    // future: redirect with user's email as a cookie
    // so we can save it to user's profile
    return redirect("/dashboard");
  },
  async onSignout() {
    return redirect("/");
  },
});

export function loader(args: LoaderFunctionArgs) {
  return loaderFn(args);
}
