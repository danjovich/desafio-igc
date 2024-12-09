import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./kanban-card";
import Column from "~/interfaces/Column";
import { Button } from "../ui/button";
import { useNavigate } from "@remix-run/react";

interface KanbanColumnProps {
  column: Column;
}

export default function KanbanColumn({ column }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: column,
  });

  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-40 p-1 min-w-32">
      <h3 className="font-bold">{column.title}</h3>
      <div
        ref={setNodeRef}
        className="flex flex-col bg-slate-200 dark:bg-slate-800 rounded-lg p-2"
      >
        {column.tasks.map((task) => (
          <KanbanCard task={task} key={task.id} />
        ))}
        <Button
          onClick={() => navigate(`tasks/new?column=${column.id}`)}
          className="bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white"
        >
          +
        </Button>
      </div>
    </div>
  );
}
