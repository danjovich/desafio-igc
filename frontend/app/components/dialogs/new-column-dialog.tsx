import { Form } from "@remix-run/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DialogHeader, DialogTitle } from "../ui/dialog";

export default function NewColumnDialog() {
  return (
    <div className="w-fit max-h-screen overflow-y-scroll grid gap-y-3">
      <DialogHeader>
        <DialogTitle>Criar Coluna</DialogTitle>
      </DialogHeader>
      <Form method="post" className="grid gap-y-3">
        <Input type="text" name="title" />
        <Button type="submit">Criar</Button>
      </Form>
    </div>
  );
}
