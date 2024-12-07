import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./kanban-card";
import Task from "~/interfaces/Task";

interface KanbanColumnProps {
  title: string;
  items: Task[];
}

export default function KanbanColumn({ items, title }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: title,
  });

  return (
    <div className="flex flex-col min-h-40 p-1">
      <h3 className="font-bold">{title}</h3>
      <div
        ref={setNodeRef}
        className="flex flex-col bg-gray-200 rounded-lg p-2"
      >
        {items.map(({ title: cardTitle }, key) => (
          <KanbanCard title={cardTitle} key={key} index={key} parent={title} />
        ))}
      </div>
    </div>
  );
}
