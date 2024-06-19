import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createApi } from "unsplash-js";
import { auth } from "~/services/auth.server";

export async function action({ request }: LoaderFunctionArgs) {
  const session = auth.getSession(request);
  const isSignedIn = await session.isSignedIn();
  if (!isSignedIn) throw redirect("/login");

  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "";
  const page = Number(url.searchParams.get("page")) || 1;
  const api = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY || " ",
  });

  const result = query
    ? await api.search
        .getPhotos({
          query,
          page,
          perPage: 20,
        })
        .catch((err) => {
          return { type: "error", response: null, errors: err.message || "" };
        })
    : await api.photos
        .getRandom({ count: 20 })
        .then((res) => {
          return {
            type: res.type,
            response: { results: res.response as [], total_pages: 1 },
            errors: res.errors,
            random: true,
          };
        })
        .catch((err) => {
          return { type: "error", response: null, errors: err.message || "" };
        });

  const res =
    result.type === "success"
      ? { type: result.type, ...result.response }
      : { type: result.type, message: result.errors };

  return json({ ...res, page, accessKey: process.env.UNSPLASH_ACCESS_KEY });
}

export type UnsplashData = typeof action;
