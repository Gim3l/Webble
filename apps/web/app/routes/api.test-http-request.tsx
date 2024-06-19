import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = auth.getSession(request);
  const isSignedIn = await session.isSignedIn();
  if (!isSignedIn) throw redirect("/login");

  const formData = await request.formData();
  const url = formData.get("url") as string;
  const method = formData.get("method") as string;

  const data = await fetch(url, { method }).then(async (res) => ({
    status: res.status,
    data: await res.json(),
  }));

  console.log(data);

  return data;
}
