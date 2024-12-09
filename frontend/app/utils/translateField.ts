import Task from "~/interfaces/Task";

export default function translateField(field: keyof Task): string {
  switch (field) {
    case "title":
      return "Título";
    case "description":
      return "Descrição";
    case "priority":
      return "Prioridade";
    case "responsible":
      return "Responsável";
    case "columnId":
      return "Coluna";
    default:
      return field;
  }
}