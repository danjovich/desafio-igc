import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import EditTaskDialog from "~/components/dialogs/edit-task-dialog";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import Task from "~/interfaces/Task";
import ApiService from "~/services/ApiService";
import invariant from "tiny-invariant";
import Priority from "~/interfaces/Priority";
import Column from "~/interfaces/Column";
import TaskHistory from "~/interfaces/TaskHistory";
import { createClerkClient } from "@clerk/remix/api.server";

interface LoaderData {
  task: Task;
  taskHistory: TaskHistory[];
  columns: Column[];
  initialColumnId?: string;
  users: string[];
}

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.taskId, "Missing taskId param");

  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  const usersList = await clerkClient.users.getUserList();
  const users = usersList.data.map((u) =>
    u.username ?? u.emailAddresses ? u.emailAddresses[0].emailAddress : "Unknown"
  );

  // get task, task history and columns
  const task = await ApiService.getInstance().fetchTask(params.taskId);
  const taskHistory = await ApiService.getInstance().fetchTaskHistory(
    params.taskId
  );
  const columns = await ApiService.getInstance().fetchColumns();

  let actualTaskHistory = [];

  if (Array.isArray(taskHistory)) {
    // show column names instead of ids
    for (const history of taskHistory) {
      if (history.changedField === "columnId") {
        const column = columns.find((c) => c.id === history.newValue);
        if (column) {
          history.newValue = column.title;
        }

        const oldColumn = columns.find((c) => c.id === history.oldValue);
        if (oldColumn) {
          history.oldValue = oldColumn.title;
        }
      }

      actualTaskHistory.push(history);
    }
  } else {
    actualTaskHistory = taskHistory;
  }

  const url = new URL(request.url);
  const initialColumnId = url.searchParams.get("column");

  return {
    task: task.id ? task : null,
    columns,
    initialColumnId,
    taskHistory: actualTaskHistory,
    users,
  } as LoaderData;
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.taskId, "Missing taskId param");
  const id = params.taskId;

  const formData = await request.formData();

  const del = formData.get("delete") as string | null;

  if (del) {
    await ApiService.getInstance().deleteTask(id);

    return redirect("/");
  }

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
  const { task, columns, initialColumnId, taskHistory, users }: LoaderData =
    useLoaderData();

  const navigate = useNavigate();

  const onOpenChange = () => {
    navigate("/");
  };

  return (
    <Dialog defaultOpen modal onOpenChange={onOpenChange}>
      <DialogContent className="w-fit">
        <EditTaskDialog
          task={task}
          taskHistory={taskHistory}
          columns={columns}
          initialColumnId={initialColumnId}
          users={users}
        />
      </DialogContent>
    </Dialog>
  );
}
