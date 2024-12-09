import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
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
import { ColumnsContextProvider } from "./contexts/columns-context";

interface LoaderData {
  theme: Theme | null;
  env: Record<string, string | undefined>;
}

export async function loader(args: LoaderFunctionArgs) {
  // clerk auth
  return rootAuthLoader(args, async ({ request }) => {
    const { userId, getToken } = request.auth;

    if (userId) {
      ApiService.getTokenFunction = async () => await getToken();
    }
    // Returns the theme from the session storage
    const { getTheme } = await themeSessionResolver(request);

    return {
      theme: getTheme(),
      env: {
        // for allowing the client side to access the API_URL
        API_URL: process.env.API_URL,
      },
    };
  });
}

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
        <div className="flex justify-center min-h-screen -z-10">
          <ModeToggle />

          <SignedIn>
            <Kanban />
            <Outlet />
          </SignedIn>

          <SignedOut>
            <p>Você não está logado!</p>

            <SignInButton>Fazer Login</SignInButton>
          </SignedOut>
        </div>

        <ScrollRestoration />
        <script
          // as weird as this is, it is recommended by the docs
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(data.env)}`,
          }}
        />
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
      {/* provider for columns  */}
      <ColumnsContextProvider>
        <App />
      </ColumnsContextProvider>
    </ThemeProvider>
  );
}

export default ClerkApp(AppWithProviders, {
  localization: ptBR,
});
