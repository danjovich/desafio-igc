import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type {
  ActionFunction,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { ClerkApp, SignedIn, SignedOut, SignInButton } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ptBR } from "@clerk/localizations";

import "./tailwind.css";
import { themeSessionResolver } from "./sessions.server";
import {
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import clsx from "clsx";
import ApiService from "./services/ApiService";
import ModeToggle from "./components/mode-toggle";
import Kanban from "./components/kanban/kanban";
import Column from "./interfaces/Column";

interface LoaderData {
  theme: Theme | null;
  columns: Column[];
}

export async function loader(args: LoaderFunctionArgs) {
  // clerk auth
  return rootAuthLoader(args, async ({ request }) => {
    const { userId, getToken } = request.auth;

    let columns: Column[] = [];
    if (userId) {
      ApiService.getTokenFunction = async () => await getToken();

      columns = await ApiService.getInstance().fetchColumns();
    }
    // Returns the theme from the session storage
    const { getTheme } = await themeSessionResolver(request);

    return {
      theme: getTheme(),
      columns,
    };
  });
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const columnsString = formData.get("columns") as string;

  if (columnsString) {
    const columns = JSON.parse(columnsString);

    return await ApiService.getInstance().updateColumns(columns);
  }

  const title = formData.get("columnTitle") as string;
  const id = formData.get("columnId") as string;
  const del = formData.get("delete") as string | null;

  if (del) {
    await ApiService.getInstance().deleteColumn(id);
    return null;
  } else {
    const column = await ApiService.getInstance().updateColumn(id, title);

    return column;
  }
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function App() {
  const data: LoaderData = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  // const { columns } = useColumns();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <div className="flex justify-center min-h-screen -z-10 w-full overflow-scroll">
          <ModeToggle />

          <SignedIn>
            <Kanban columns={data.columns} />
            <Outlet />
          </SignedIn>

          <SignedOut>
            <p>Você não está logado!</p>

            <SignInButton>Fazer Login</SignInButton>
          </SignedOut>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    // Wraps the app with ThemeProvider for allowing change themes.
    // `specifiedTheme` is the stored theme in the session storage.
    // `themeAction` is the action name that's used to change the theme in the session storage.
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export default ClerkApp(AppWithProviders, {
  localization: ptBR,
});
