import {
  DndContext,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import Task from "~/interfaces/Task";
import KanbanColumn from "./kanban-column";
import { tasks0, tasks1, tasks2, tasks3 } from "~/data";
import Column from "~/interfaces/Column";

export default function Kanban() {
  // TODO: add sensor for touch devices
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 0, distance: 0, tolerance: 0 },
    })
  );

  const [columns, setColumns] = useState<Column[]>([
    { id: "1", title: "ToDo", tasks: tasks0 },
    { id: "2", title: "Done", tasks: tasks1 },
    { id: "3", title: "In Progress", tasks: tasks2 },
    { id: "4", title: "Unassigned", tasks: tasks3 },
  ]);

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

        const newItems = columns.map((column) => {
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

        console.log(newItems);

        setColumns(newItems);
      }}
    >
      <div className="flex flex-col">
        <button>Adicionar</button>
        <div className="flex">
          {columns.map((column) => (
            <KanbanColumn column={column} key={column.id} />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
