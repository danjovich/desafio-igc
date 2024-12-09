import Priority from "./interfaces/Priority";
import Task from "./interfaces/Task";

export const tasks0: Task[] = [
  {
    id: "-1",
    title: "Create a new project",
    description: "Create a new project using Remix",
    priority: Priority.High,
    columnId: "1",
    responsible: {
      id: 1,
      name: "John Doe",
      email: "john.doe@test.com",
    },
  },
  {
    id: "-2",
    title: "Create a new task",
    description: "Create a new task on the project",
    priority: Priority.Medium,
    columnId: "1",
    responsible: {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@test.com",
    },
  },
  {
    id: "-3",
    title: "Create a new user",
    description: "Create a new user on the project",
    priority: Priority.Low,
    columnId: "1",
    responsible: {
      id: 3,
      name: "John Smith",
      email: "john.smith@test.com",
    },
  },
];

export const tasks1: Task[] = [
  {
    id: "1",
    title: "Create a new project",
    description: "Create a new project using Remix",
    priority: Priority.High,
    columnId: "2",
    responsible: {
      id: 1,
      name: "John Doe",
      email: "john.doe@test.com",
    },
  },
  {
    id: "2",
    title: "Create a new task",
    description: "Create a new task on the project",
    priority: Priority.Medium,
    columnId: "2",
    responsible: {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@test.com",
    },
  },
  {
    id: "3",
    title: "Create a new user",
    description: "Create a new user on the project",
    priority: Priority.Low,
    columnId: "2",
    responsible: {
      id: 3,
      name: "John Smith",
      email: "john.smith@test.com",
    },
  },
];

export const tasks2: Task[] = [
  {
    id: "4",
    title: "Create a new project",
    description: "Create a new project using Remix",
    priority: Priority.High,
    columnId: "3",
    responsible: {
      id: 1,
      name: "John Doe",
      email: "john.doe@test.com",
    },
  },
  {
    id: "5",
    title: "Create a new task",
    description: "Create a new task on the project",
    priority: Priority.Medium,
    columnId: "3",
    responsible: {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@test.com",
    },
  },
  {
    id: "6",
    title: "Create a new user",
    description: "Create a new user on the project",
    priority: Priority.Low,
    columnId: "3",
    responsible: {
      id: 3,
      name: "John Smith",
      email: "john.smith@test.com",
    },
  },
];

export const tasks3: Task[] = [
  {
    id: "7",
    title: "Create a new project",
    description: "Create a new project using Remix",
    priority: Priority.High,
    columnId: "4",
    responsible: {
      id: 1,
      name: "John Doe",
      email: "john.doe@test.com",
    },
  },
  {
    id: "8",
    title: "Create a new task",
    description: "Create a new task on the project",
    priority: Priority.Medium,
    columnId: "4",
    responsible: {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@test.com",
    },
  },
  {
    id: "9",
    title: "Create a new user",
    description: "Create a new user on the project",
    priority: Priority.Low,
    columnId: "4",
    responsible: {
      id: 3,
      name: "John Smith",
      email: "john.smith@test.com",
    },
  },
];

export function findTask(id: string): Task | undefined {
  return [...tasks0, ...tasks1, ...tasks2, ...tasks3].find((task) => task.id === id);
}