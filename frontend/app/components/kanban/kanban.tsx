import {
  DndContext,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Task from "~/interfaces/Task";
import KanbanColumn from "./kanban-column";
import { NavLink } from "@remix-run/react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import Column from "~/interfaces/Column";

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

  // const addNewCard = (title: string) => {
  //   setItems([...items, { title, description: "", priority: Priority.Low }]);
  // };

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

        const newItems = internalColumns.map((column) => {
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
        });

        setInternalColumns(newItems);
      }}
    >
      <div className="flex flex-col">
        <div className="flex">
          {internalColumns.map((column) => (
            <KanbanColumn column={column} key={column.id} />
          ))}
        </div>
        <NavLink to="/columns/new" className="flex justify-center mt-3">
          <Button type="submit">Adicionar coluna</Button>
        </NavLink>
      </div>
    </DndContext>
  );
}
