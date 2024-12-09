import Priority from "./Priority";

export default interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  responsible?: string;
  columnId: string;
}
