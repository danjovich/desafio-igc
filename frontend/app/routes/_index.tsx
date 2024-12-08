import { SignedIn, SignedOut, SignInButton } from "@clerk/remix";
import { type MetaFunction } from "@remix-run/node";
import Kanban from "~/components/kanban/kanban";
import ModeToggle from "~/components/mode-toggle";

export const meta: MetaFunction = () => {
  return [
    { title: "Kanban Colaborativo" },
    {
      name: "description",
      content: "Sistema de quadro kanban colaborativo para uso interno",
    },
  ];
};

export default function Index() {
  return (
    <div className="flex justify-center min-h-screen -z-10">
      <ModeToggle />

      <SignedIn>
        <Kanban />
      </SignedIn>

      <SignedOut>
        <p>Você não está logado!</p>

        <SignInButton>Fazer Login</SignInButton>
      </SignedOut>
    </div>
  );
}
