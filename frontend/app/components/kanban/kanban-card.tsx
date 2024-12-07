import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "../ui/card";

interface KanbanCardProps {
  title: string;
  index: number;
  parent: string;
}

export default function KanbanCard({ title, index, parent }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: title,
    data: {
      title,
      index,
      parent,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card {...listeners} {...attributes} ref={setNodeRef} style={style}>
      <p>{title}</p>
    </Card>
  );
}
