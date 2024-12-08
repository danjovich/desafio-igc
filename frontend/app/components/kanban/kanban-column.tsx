import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./kanban-card";
import Column from "~/interfaces/Column";

interface KanbanColumnProps {
  column: Column;
}

export default function KanbanColumn({ column }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: column,
  });

  return (
    <div className="flex flex-col min-h-40 p-1">
      <h3 className="font-bold">{column.title}</h3>
      <div
        ref={setNodeRef}
        className="flex flex-col bg-gray-200 rounded-lg p-2"
      >
        {[...column.tasks].map((task) => (
          <KanbanCard task={task} key={task.id} />
        ))}
      </div>
    </div>
  );
}
