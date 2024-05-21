import "@mantine/core/styles.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ContextMenuProvider } from "mantine-contextmenu";
import "mantine-contextmenu/styles.layer.css";

import { createTheme, MantineProvider, rem } from "@mantine/core";

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

  headings: {
    fontFamily: "Roboto, sans-serif",
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript defaultColorScheme="dark" />
        <script src="/webble-chatbox/index.js" />
      </head>
      <body>
        <div id="main"></div>
        <MantineProvider defaultColorScheme="dark" theme={theme}>
          <ContextMenuProvider>{children}</ContextMenuProvider>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
