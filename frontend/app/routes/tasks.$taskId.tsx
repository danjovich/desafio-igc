import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import EditTaskDialog from "~/components/dialogs/edit-task-dialog";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import Task from "~/interfaces/Task";
import ApiService from "~/services/ApiService";
import invariant from "tiny-invariant";
import Priority from "~/interfaces/Priority";

interface LoaderData {
  task: Task;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.taskId, "Missing taskId param");

  const task = await ApiService.getInstance().fetchTask(params.taskId);

  return {
    task,
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

  priority &&
    invariant(
      Object.values(Priority).includes(priority),
      "Prioridade inválida"
    );

  await ApiService.getInstance().updateTask({
    id,
    title,
    description,
    priority,
    responsible,
  });

  return redirect("/");
};

export default function EditTask() {
  const { task }: LoaderData = useLoaderData();

  const navigate = useNavigate();

  const onOpenChange = () => {
    navigate("/");
  };

  return (
    <Dialog defaultOpen modal onOpenChange={onOpenChange}>
      <DialogContent className="w-fit">
        <EditTaskDialog task={task} />
      </DialogContent>
    </Dialog>
  );
}
