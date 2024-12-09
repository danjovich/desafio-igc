import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import EditTaskDialog from "~/components/dialogs/edit-task-dialog";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import Task from "~/interfaces/Task";
import ApiService from "~/services/ApiService";
import invariant from "tiny-invariant";

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

export const action: ActionFunction = async () => {
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
      <DialogContent>
        <EditTaskDialog task={task} />
      </DialogContent>
    </Dialog>
  );
}
