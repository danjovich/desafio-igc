import { DndContext, rectIntersection } from "@dnd-kit/core";
import { useState } from "react";
import Priority from "~/interfaces/Priority";
import Task from "~/interfaces/Task";
import KanbanColumn from "./kanban-column";

export default function Kanban() {
  const [todoItems, setTodoItems] = useState<Task[]>([{
    title: "Task 1",
    description: "Description 1",
    priority: Priority.Low,
  }]);
  const [doneItems, setDoneItems] = useState<Task[]>([]);
  const [inProgressItems, setInProgressItems] = useState<Task[]>([]);
  const [items, setItems] = useState<Task[]>([]);

  // const addNewCard = (title: string) => {
  //   setItems([...items, { title, description: "", priority: Priority.Low }]);
  // };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={(e) => {
        const container = e.over?.id;
        const task = e.active.data.current as Task | undefined;
        const index = e.active.data.current?.index ?? 0;
        const parent = e.active.data.current?.parent ?? "ToDo";
        if (container === "ToDo") {
          task && setTodoItems([...todoItems, task]);
        } else if (container === "Done") {
          task && setDoneItems([...doneItems, task]);
        } else if (container === "Unassigned") {
          task && setItems([...items, task]);
        } else {
          task && setInProgressItems([...inProgressItems, task]);
        }
        if (parent === "ToDo") {
          setTodoItems([
            ...todoItems.slice(0, index),
            ...todoItems.slice(index + 1),
          ]);
        } else if (parent === "Done") {
          setDoneItems([
            ...doneItems.slice(0, index),
            ...doneItems.slice(index + 1),
          ]);
        } else if (parent === "Unassigned") {
          setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        } else {
          setInProgressItems([
            ...inProgressItems.slice(0, index),
            ...inProgressItems.slice(index + 1),
          ]);
        }
      }}
    >
      <div className="flex flex-col">
        <button>Adicionar</button>
        <div className="flex">
          <KanbanColumn title="ToDo" items={todoItems} />
          <KanbanColumn title="In Progress" items={inProgressItems} />
          <KanbanColumn title="Done" items={doneItems} />
          <KanbanColumn title="Unassigned" items={items} />
        </div>
      </div>
    </DndContext>
  );
}
