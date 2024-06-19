import { GiphyFetch } from "@giphy/js-fetch-api";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = auth.getSession(request);
  const isSignedIn = await session.isSignedIn();
  if (!isSignedIn) throw redirect("/login");

  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "";
  const offset = Number(url.searchParams.get("offset") || "");
  const gf = new GiphyFetch(process.env.GIPHY_API_KEY || " ");

  const result = query
    ? await gf.search(query, { offset, rating: "pg-13" })
    : await gf.trending({ offset, rating: "pg-13" });

  return json(result);
}

export type GiphyLoaderData = typeof loader;
