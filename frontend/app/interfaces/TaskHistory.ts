export default interface TaskHistory {
  id: string;
  taskId: string;
  changedField: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: Date;
}
