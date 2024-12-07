import Priority from "./Priority";
import User from "./User";

export default interface Task {
  title: string;
  description: string;
  priority: Priority;
  responsible?: User;
}
