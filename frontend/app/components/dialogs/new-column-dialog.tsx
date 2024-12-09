import { Form } from "@remix-run/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function NewColumnDialog() {
  return (
    <Form method="post">
      <Input type="text" name="title" />
      <Button type="submit">Criar</Button>
    </Form>
  );
}
