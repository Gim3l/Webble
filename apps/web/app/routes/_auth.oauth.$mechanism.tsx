import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export function loader({ params }: LoaderFunctionArgs) {
  if (params.mechanism === "github") {
    return redirect(auth.getOAuthUrl("builtin::oauth_github"));
  }

  if (params.mechanism === "google") {
    return redirect(auth.getOAuthUrl("builtin::oauth_google"));
  }

  return redirect("/login");
}
