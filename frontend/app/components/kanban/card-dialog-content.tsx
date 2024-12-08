import Task from "~/interfaces/Task";
import { Dialog } from "../ui/dialog";

interface CardDialogContentProps {
  task: Task;
}

export default function CardDialogContent({ task }: CardDialogContentProps) {
  return (
    <Dialog>
      <p>{task.title}</p>
    </Dialog>
  );
}
