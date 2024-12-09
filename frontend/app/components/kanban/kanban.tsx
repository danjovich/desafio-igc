import {
  DndContext,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Task from "~/interfaces/Task";
import KanbanColumn from "./kanban-column";
import { NavLink, useFetcher, useRevalidator } from "@remix-run/react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import Column from "~/interfaces/Column";
import { Input } from "../ui/input";
import { useSocket } from "~/contexts/socket-context";

interface KanbanProps {
  columns: Column[];
}

export default function Kanban({ columns }: KanbanProps) {
  // TODO: add sensor for touch devices
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 100, distance: 1 },
    })
  );

  const [internalColumns, setInternalColumns] = useState(columns);

  useEffect(() => {
    setInternalColumns(columns);
  }, [columns]);

  const columnsWithIds = internalColumns.map((column, index) => ({
    ...column,
    index: index,
  }));

  const columnsRef = useRef<HTMLInputElement>(null);
  const changeColumnsRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher();

  const socket = useSocket();
  const revalidator = useRevalidator();

  useEffect(() => {
    if (!socket) return;

    socket.on("reload", () => {
      revalidator.revalidate();
    });
  }, [socket, revalidator]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={(e) => {
        const newColumnId = e.over?.id;
        const task = e.active.data.current as Task | undefined;
        const oldColumnId = task?.columnId;

        if (!task || !task.id) return;
        if (!newColumnId || newColumnId === oldColumnId) return;

        task.columnId = newColumnId as string;

        const newItems = Array.isArray(internalColumns) ? internalColumns.map((column) => {
          if (column.id === newColumnId) {
            // adds the task to the new column
            return {
              ...column,
              tasks: [...column.tasks, task],
            };
          } else if (column.id === oldColumnId) {
            // removes the task from the old column
            return {
              ...column,
              tasks: column.tasks.filter((t) => t.id !== task.id),
            };
          }
          return column;
        }) : [];

        setInternalColumns(newItems);
        if (columnsRef.current) {
          columnsRef.current.value = JSON.stringify(newItems);
        }
        changeColumnsRef.current?.click();
      }}
    >
      <div className="flex flex-col w-fit">
        <fetcher.Form method="patch">
          <Input
            ref={columnsRef}
            className="hidden"
            name="columns"
            readOnly
            defaultValue={JSON.stringify(internalColumns)}
          />
          <Input ref={changeColumnsRef} type="submit" className="hidden" />
        </fetcher.Form>
        <div className="flex">
          {columnsWithIds.map((column) => (
            <KanbanColumn
              column={column}
              key={column.index.toString() + column.id}
            />
          ))}
        </div>
        <NavLink to="/columns/new" className="flex justify-center mt-3">
          <Button>Adicionar coluna</Button>
        </NavLink>
      </div>
    </DndContext>
  );
}
