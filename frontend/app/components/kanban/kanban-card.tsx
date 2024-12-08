import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "../ui/card";
import Task from "~/interfaces/Task";

interface KanbanCardProps {
  task: Task;
}

export default function KanbanCard({ task }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { ...task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card {...listeners} {...attributes} ref={setNodeRef} style={style}>
      <p>{task.title}</p>
    </Card>
  );
}
