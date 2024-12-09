import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "../ui/card";
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
      onClick={() => navigate(`/tasks/${task.id}`)}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={style}
      className="p-2 shadow-md rounded-lg mb-2 z-10"
    >
      <CardContent className="p-0 max-w-40 overflow-scroll">{task.title}</CardContent>
    </Card>
  );
}
