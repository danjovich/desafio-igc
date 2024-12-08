import Task from "./Task";

export default interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
