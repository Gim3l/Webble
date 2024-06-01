import "@mantine/core/styles.css";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import "@mantine/notifications/styles.css";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import {
  createTheme,
  rem,
  ColorSchemeScript,
  MantineProvider,
} from "@mantine/core";
import { ContextMenuProvider } from "mantine-contextmenu";
import "mantine-contextmenu/styles.layer.css";

import { json } from "@remix-run/node";
import { NotFoundPage } from "~/components/layout/404NotFound";
import "cal-sans";
import { useEffect } from "react";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  primaryColor: "indigo",
  colors: {
    webble: [
      "#e9efff",
      "#d2daff",
      "#a3b2fa",
      "#7088f3",
      "#4664ee",
      "#2b4dec",
      "#1b42ec",
      "#0b34d2",
      "#012dbd",
      "#0027a7",
    ],
  },

  shadows: {
    md: "1px 1px 3px rgba(0, 0, 0, .25)",
    xl: "5px 5px 3px rgba(0, 0, 0, .25)",
  },

  components: {
    TextInput: { defaultProps: { radius: "md" } },
  },

  headings: {
    fontFamily: "Roboto, sans-serif",
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },
});

export function loader() {
  return json({
    isProd:
      process.env.NODE_ENV === "production" ||
      process.env.VERCEL_ENV === "production",
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript defaultColorScheme="dark" />
        {loaderData?.isProd ? (
          <script src="/webble-chatbox/index.js" />
        ) : (
          <script src="/webble-chatbox-dev/index.js" />
        )}
      </head>
      <body>
        <div id="main"></div>
        <MantineProvider defaultColorScheme="dark" theme={theme}>
          <Notifications />
          <ContextMenuProvider>{children}</ContextMenuProvider>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.state !== "idle" ? nprogress.start() : nprogress.done();
  }, [navigation.state]);

  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        {error.status == 404 ? (
          <NotFoundPage />
        ) : (
          <>
            <h1>
              {error.status} {error.statusText}
            </h1>
            <p>{error.data}</p>
          </>
        )}
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
