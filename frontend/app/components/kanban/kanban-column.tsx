import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./kanban-card";
import Column from "~/interfaces/Column";
import { Button } from "../ui/button";
import { useFetcher, useNavigate } from "@remix-run/react";
import { Input } from "../ui/input";
import { useRef } from "react";

interface KanbanColumnProps {
  column: Column;
}

export default function KanbanColumn({ column }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: column,
  });

  const navigate = useNavigate();

  const fetcher = useFetcher();

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col min-h-40 p-1 min-w-32">
      {/* fetcher.Form === A form that doesn't update the URL */}
      <fetcher.Form method="put">
        <Input
          className="font-bold border-none p-1 h-fit mb-2"
          value={column.title}
          name="columnTitle"
          type="text"
          onChange={() => inputRef.current?.click()}
        />
        <Input
          defaultValue={column.id}
          name="columnId"
          type="text"
          hidden
          className="hidden"
        />
        <Input ref={inputRef} type="submit" hidden className="hidden" />
      </fetcher.Form>

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
