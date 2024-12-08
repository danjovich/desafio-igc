import Task from "~/interfaces/Task";
import { Input } from "../ui/input";
import { Form } from "@remix-run/react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Priority from "~/interfaces/Priority";
import Editor from "../editor";
import { useEffect, useState } from "react";

interface CardDialogContentProps {
  task: Task;
}

export default function CardDialogContent({
  task: defaultTask,
}: CardDialogContentProps) {
  const [task, setTask] = useState(defaultTask);

  useEffect(() => {
    console.log(task.description);
  }, [task]);

  return (
    <Form method="post">
      <Label>Título</Label>
      <Input
        type="text"
        name="title"
        defaultValue={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />

      <Label>Descrição</Label>
      <input type="hidden" name="description" defaultValue={task.description} />
      <Editor
        content={task.description}
        onChange={(v) => setTask({ ...task, description: v })}
      />

      <Label>Prioridade</Label>
      <Select
        name="priority"
        value={task.priority}
        onValueChange={(v) => setTask({ ...task, priority: v as Priority })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione a prioridade" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Prioridades</SelectLabel>
            <SelectItem value={Priority.Low}>Baixa</SelectItem>
            <SelectItem value={Priority.Medium}>Média</SelectItem>
            <SelectItem value={Priority.High}>Alta</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Label>Responsável</Label>
      <Select
        name="responsible"
        value={task.responsible?.name}
        // TODO: update user
        onValueChange={() => setTask({ ...task })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o responsável" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Usuários</SelectLabel>
            {["John Doe", "Jane Doe", "John Smith"].map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="submit">Save</Button>
    </Form>
  );
}
