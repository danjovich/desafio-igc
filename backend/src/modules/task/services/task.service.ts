import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';
import CreateTaskDTO from '../dtos/CreateTaskDTO';
import UpdateTaskDTO from '../dtos/UpdateTaskDTO';
import Priority from '../enums/Priority';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: CreateTaskDTO): Promise<Task> {
    if (!Object.values(Priority).includes(data.priority)) {
      throw new BadRequestException(`Invalid priority ${data.priority}`);
    }

    return this.prisma.task.create({
      data,
    });
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

  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (data.priority && !Object.values(Priority).includes(data.priority)) {
      throw new BadRequestException(`Invalid priority ${data.priority}`);
    }

    return this.prisma.task.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteTask(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
