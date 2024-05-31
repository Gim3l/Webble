import { json, LoaderFunctionArgs } from "@remix-run/node";
import { createApi } from "unsplash-js";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "";
  const api = createApi({
    // Don't forget to set your access token here!
    // See https://unsplash.com/developers
    accessKey: process.env.UNSPLASH_ACCESS_KEY || " ",
  });

  const result = await api.search.getPhotos({
    query,
    orientation: "landscape",
  });

  return json(result);
}

export type UnsplashLoaderData = typeof loader;
