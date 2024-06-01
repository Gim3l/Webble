import { GiphyFetch } from "@giphy/js-fetch-api";
import { json, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
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
