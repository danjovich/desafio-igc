import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import EditTaskDialog from "~/components/dialogs/edit-task-dialog";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import Task from "~/interfaces/Task";
import ApiService from "~/services/ApiService";
import invariant from "tiny-invariant";
import Priority from "~/interfaces/Priority";
import Column from "~/interfaces/Column";

interface LoaderData {
  task: Task;
  columns: Column[];
  initialColumnId?: string;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.taskId, "Missing taskId param");

  const task = await ApiService.getInstance().fetchTask(params.taskId);
  const columns = await ApiService.getInstance().fetchColumns();

  const url = new URL(request.url);
  const initialColumnId = url.searchParams.get("column");

  return {
    task: task.id ? task : null,
    columns,
    initialColumnId,
  } as LoaderData;
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.taskId, "Missing taskId param");

  const formData = await request.formData();

  const id = params.taskId;
  const title = (formData.get("title") as string | null) ?? undefined;
  const description =
    (formData.get("description") as string | null) ?? undefined;
  const priority = (formData.get("priority") as Priority | null) ?? undefined;
  const responsible =
    (formData.get("responsible") as string | null) ?? undefined;
  const columnId = (formData.get("column") as string | null) ?? undefined;

  priority &&
    invariant(
      Object.values(Priority).includes(priority),
      "Prioridade inválida"
    );

  if (id === "new") {
    invariant(title, "Título não pode ser vazio");
    invariant(priority, "Prioridade não pode ser vazia");
    invariant(columnId, "A coluna não pode ser vazia");

    await ApiService.getInstance().createTask({
      title,
      description: description ?? "",
      priority,
      responsible,
      columnId,
    });

    return redirect("/");
  }

  await ApiService.getInstance().updateTask({
    id,
    title,
    description,
    priority,
    responsible,
    columnId,
  });

  return redirect("/");
};

export default function EditTask() {
  const { task, columns, initialColumnId }: LoaderData = useLoaderData();

  const navigate = useNavigate();

  const onOpenChange = () => {
    navigate("/");
  };

  return (
    <Dialog defaultOpen modal onOpenChange={onOpenChange}>
      <DialogContent className="w-fit">
        <EditTaskDialog
          task={task}
          columns={columns}
          initialColumnId={initialColumnId}
        />
      </DialogContent>
    </Dialog>
  );
}
