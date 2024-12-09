import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task, TaskHistory } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';
import CreateTaskDTO from '../dtos/CreateTaskDTO';
import UpdateTaskDTO from '../dtos/UpdateTaskDTO';
import Priority from '../enums/Priority';
import { Socket } from 'socket.io-client';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@Injectable()
@WebSocketGateway({ cors: true })
export class TaskService {
  constructor(private prisma: PrismaService) {}

  @WebSocketServer() server: Socket;

  async createTask(data: CreateTaskDTO): Promise<Task> {
    if (!Object.values(Priority).includes(data.priority)) {
      throw new BadRequestException(`Invalid priority ${data.priority}`);
    }

    const createdTask = await this.prisma.task.create({
      data,
    });

    this.server.emit('reload');

    return createdTask;
  }

  async getTasks(): Promise<
    (Task & { column: { id: string; title: string } })[]
  > {
    return this.prisma.task.findMany({
      include: {
        column: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async getTask(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async getTaskHistory(id: string): Promise<TaskHistory[]> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.taskHistory.findMany({
      where: {
        taskId: id,
      },
    });
  }

  private async updateTaskHistory(
    taskId: string,
    previousTask: Task,
    updatedTask: Task,
  ): Promise<void> {
    if (previousTask.columnId !== updatedTask.columnId) {
      await this.prisma.taskHistory.create({
        data: {
          taskId,
          changedField: 'columnId',
          oldValue: previousTask.columnId,
          newValue: updatedTask.columnId,
        },
      });
    }

    if (previousTask.priority !== updatedTask.priority) {
      await this.prisma.taskHistory.create({
        data: {
          taskId,
          changedField: 'priority',
          oldValue: previousTask.priority,
          newValue: updatedTask.priority,
        },
      });
    }

    if (previousTask.responsible !== updatedTask.responsible) {
      await this.prisma.taskHistory.create({
        data: {
          taskId,
          changedField: 'responsible',
          oldValue: previousTask.responsible,
          newValue: updatedTask.responsible,
        },
      });
    }

    if (previousTask.title !== updatedTask.title) {
      await this.prisma.taskHistory.create({
        data: {
          taskId,
          changedField: 'title',
          oldValue: previousTask.title,
          newValue: updatedTask.title,
        },
      });
    }

    if (previousTask.description !== updatedTask.description) {
      await this.prisma.taskHistory.create({
        data: {
          taskId,
          changedField: 'description',
          oldValue: previousTask.description,
          newValue: updatedTask.description,
        },
      });
    }
  }

  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (data.priority && !Object.values(Priority).includes(data.priority)) {
      throw new BadRequestException(`Invalid priority ${data.priority}`);
    }

    const updatedTask = await this.prisma.task.update({
      where: {
        id,
      },
      data,
    });

    await this.updateTaskHistory(id, task, updatedTask);

    this.server.emit('reload');

    return updatedTask;
  }

  async deleteTask(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    this.server.emit('reload');

    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
