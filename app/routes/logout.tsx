import { redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export async function loader() {
  const { headers } = await auth.signout();

  return redirect("/login", { headers });
}
