import Priority from '../enums/Priority';

export default interface CreateTaskDTO {
  title: string;
  description: string;
  priority: Priority;
  responsible?: string;
  columnId: string;
}
