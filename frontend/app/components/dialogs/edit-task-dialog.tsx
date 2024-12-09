import Task from "~/interfaces/Task";
import { Input } from "../ui/input";
import { Form, useFetcher } from "@remix-run/react";
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
import { useRef, useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog";
import Column from "~/interfaces/Column";
import { Edit, History, Trash } from "lucide-react";
import TaskHistory from "~/interfaces/TaskHistory";
import translateField from "~/utils/translateField";
import formatDate from "~/utils/formatDate";

interface EditTaskDialogContentProps {
  task: Task | null;
  taskHistory: TaskHistory[];
  columns: Column[];
  initialColumnId?: string;
}

export default function EditTaskDialog({
  task: defaultTask,
  taskHistory,
  columns,
  initialColumnId,
}: EditTaskDialogContentProps) {
  const [task, setTask] = useState(
    defaultTask ?? {
      id: "",
      title: "",
      description: "",
      priority: Priority.Low,
      responsible: null,
      columnId: initialColumnId ?? "",
    }
  );

  const [showHistory, setShowHistory] = useState(false);

  const fetcher = useFetcher();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-fit max-h-screen overflow-y-scroll">
      <DialogHeader>
        <DialogTitle>
          {showHistory ? "Histórico da tarefa" : "Editar tarefa"}
        </DialogTitle>
        <fetcher.Form method="delete">
          <Input
            className="hidden"
            hidden
            name="delete"
            type="checkbox"
            defaultChecked={true}
          />
          <Input ref={inputRef} type="submit" hidden className="hidden" />
          <Button
            onClick={() => inputRef.current?.click()}
            className="absolute top-2 right-9 h-8 w-5 bg-transparent dark:bg-transparent dark:text-slate-200 text-slate-800 hover:bg-slate-300 dark:hover:bg-slate-800"
          >
            <Trash />
          </Button>
        </fetcher.Form>
        {defaultTask && (
          <Button
            onClick={() => setShowHistory(!showHistory)}
            className="absolute top-[2px] right-16 h-8 w-5 bg-transparent dark:bg-transparent dark:text-slate-200 text-slate-800 hover:bg-slate-300 dark:hover:bg-slate-800"
          >
            {showHistory ? <Edit /> : <History />}
          </Button>
        )}
      </DialogHeader>

      {showHistory ? (
        taskHistory && taskHistory.length > 0 ? (
          taskHistory.map((history) => (
            <div key={history.id} className="py-2">
              <h3 className="text-lg font-semibold">
                {formatDate(new Date(history.createdAt))}
              </h3>
              <p>
                {translateField(history.changedField as keyof Task)} alterado(a) de{" "}
                &quot;{history.oldValue}&quot; para &quot;{history.newValue}
                &quot;
              </p>
            </div>
          ))
        ) : (
          <p className="py-2 h-16 w-64 text-center">Nenhuma alteração registrada</p>
        )
      ) : (
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

          <Label htmlFor="column">Coluna</Label>
          <Select
            name="column"
            value={task.columnId}
            onValueChange={(id) => setTask({ ...task, columnId: id })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a coluna" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Colunas</SelectLabel>
                {columns.map(({ title, id }) => (
                  <SelectItem key={id} value={id} textValue={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button type="submit">Salvar</Button>
        </Form>
      )}
    </div>
  );
}
