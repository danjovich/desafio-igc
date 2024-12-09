import Column from "~/interfaces/Column";
import Task from "~/interfaces/Task";
import { serverOnly$, clientOnly$ } from "vite-env-only/macros";

export default class ApiService {
  private static instance: ApiService;

  private constructor() {
    this.apiUrl =
      serverOnly$(process.env.API_URL) ||
      clientOnly$((window as unknown as { env: Record<string, string> })?.env)
        ?.API_URL ||
      this.apiUrl;
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }

    return ApiService.instance;
  }

  private static getToken?: () => Promise<string | null>;

  public static set getTokenFunction(fn: typeof ApiService.getToken) {
    ApiService.getToken = fn;
  }

  private apiUrl = "http://localhost:3000";

  async createColumn(title: string): Promise<Column> {
    const response = await fetch(`${this.apiUrl}/columns`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await ApiService.getToken?.()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    const createdColumn = await response.json();

    return createdColumn;
  }

  async fetchColumns(): Promise<Column[]> {
    const response = await fetch(`${this.apiUrl}/columns`, {
      headers: {
        Authorization: `Bearer ${await ApiService.getToken?.()}`,
      },
    });
    const columns = await response.json();

    return columns;
  }

  async updateColumn(column: Column): Promise<Column> {
    const response = await fetch(`${this.apiUrl}/columns/${column.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${await ApiService.getToken?.()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(column),
    });
    const updatedColumn = await response.json();

    return updatedColumn;
  }

  async deleteColumn(columnId: string): Promise<void> {
    await fetch(`${this.apiUrl}/columns/${columnId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await ApiService.getToken?.()}`,
      },
    });
  }

  async createTask(task: Task): Promise<Task> {
    const response = await fetch(`${this.apiUrl}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await ApiService.getToken?.()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const createdTask = await response.json();

    return createdTask;
  }

  async fetchTasks(): Promise<Task[]> {
    const response = await fetch(`${this.apiUrl}/tasks`, {
      headers: {
        Authorization: `Bearer ${await ApiService.getToken?.()}`,
      },
    });
    const tasks = await response.json();

    return tasks;
  }

  async fetchTask(taskId: string): Promise<Task> {
    const response = await fetch(`${this.apiUrl}/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${await ApiService.getToken?.()}`,
      },
    });
    const task = await response.json();

    return task;
  }

  async updateTask(task: Task): Promise<Task> {
    const response = await fetch(`${this.apiUrl}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${await ApiService.getToken?.()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const updatedTask = await response.json();

    return updatedTask;
  }

  async deleteTask(taskId: string): Promise<void> {
    await fetch(`${this.apiUrl}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await ApiService.getToken?.()}`,
      },
    });
  }
}
