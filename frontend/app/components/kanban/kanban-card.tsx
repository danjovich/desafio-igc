import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardTitle } from "../ui/card";
import Task from "~/interfaces/Task";
import { useNavigate } from "@remix-run/react";

interface KanbanCardProps {
  task: Task;
}

export default function KanbanCard({ task }: KanbanCardProps) {
  const navigate = useNavigate();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { ...task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card
      onClickCapture={() => navigate(`/tasks/${task.id}`)}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={style}
    >
      <CardTitle>{task.title}</CardTitle>
    </Card>
  );
}
