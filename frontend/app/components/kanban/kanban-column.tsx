import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./kanban-card";
import Column from "~/interfaces/Column";
import { Button } from "../ui/button";
import { useFetcher, useNavigate } from "@remix-run/react";
import { Input } from "../ui/input";
import { useRef } from "react";
import { Trash } from "lucide-react";

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
  const checkRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col min-h-40 p-1 min-w-32">
      {/* fetcher.Form === A form that doesn't update the URL */}
      <fetcher.Form method="put">
        <div className="m-0 p-0 relative group">
          <div className="pr-5 mb-2 w-32">
            <Input
              className="font-bold border-none p-1"
              value={column.title}
              name="columnTitle"
              type="text"
              onChange={() => {
                if (checkRef.current) checkRef.current.checked = false;
                inputRef.current?.click();
              }}
            />
          </div>
          <Input
            ref={checkRef}
            className="hidden"
            hidden
            name="delete"
            type="checkbox"
            defaultChecked={false}
          />
          <Button
            className="absolute top-1 right-0 h-8 w-5 bg-transparent dark:bg-transparent dark:text-slate-200 text-slate-800 hidden group-hover:flex hover:bg-slate-800 dark:hover:bg-slate-800"
            onClick={() => {
              if (checkRef.current) checkRef.current.checked = true;
              inputRef.current?.click();
            }}
          >
            <Trash />
          </Button>
        </div>
        <Input
          value={column.id}
          readOnly
          name="columnId"
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
