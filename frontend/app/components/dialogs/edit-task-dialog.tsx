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
import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog";

interface EditTaskDialogContentProps {
  task: Task | null;
}

export default function EditTaskDialog({ task: defaultTask }: EditTaskDialogContentProps) {
  const [task, setTask] = useState(defaultTask ?? {
    id: "",
    title: "",
    description: "",
    priority: Priority.Low,
    responsible: null,
    columnId: "",
  });

  useEffect(() => {
    console.log(task.description);
  }, [task]);

  return (
    <div className="w-fit">
      <DialogHeader>
        <DialogTitle>Editar tarefa</DialogTitle>
      </DialogHeader>

      <Form className="grid gap-4 py-4" method="put">
        <Label>Título</Label>
        <Input
          type="text"
          name="title"
          defaultValue={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />

        <Label htmlFor="description">Descrição</Label>
        <Input type="hidden" name="description" value={task.description} />
        <Editor
          content={task.description}
          onChange={(v) => setTask({ ...task, description: v })}
        />

        <Label htmlFor="priority">Prioridade</Label>
        <Select
          name="priority"
          value={task.priority}
          onValueChange={(v) => setTask({ ...task, priority: v as Priority })}
        >
          <SelectTrigger>
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

        <Label htmlFor="responsible">Responsável</Label>
        <Select
          name="responsible"
          value={task.responsible?.name}
          // TODO: update user
          onValueChange={() => setTask({ ...task })}
        >
          <SelectTrigger>
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
        <Button type="submit">Salvar</Button>
      </Form>
    </div>
  );
}
