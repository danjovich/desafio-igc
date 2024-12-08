import Priority from "./Priority";
import User from "./User";

export default interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  responsible?: User;
  column_id: string;
}
