import { Injectable, NotFoundException } from '@nestjs/common';
import { Column, Task } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';
import CreateColumnDTO from '../dtos/CreateColumnDTO';
import UpdateColumnDTO from '../dtos/UpdateColumnDTO';

@Injectable()
export class ColumnService {
  constructor(private prisma: PrismaService) {}

  async createColumn(data: CreateColumnDTO): Promise<Column> {
    return this.prisma.column.create({
      data,
    });
  }

  async getColumns(): Promise<
    (Column & { tasks: { id: string; title: string }[] })[]
  > {
    return this.prisma.column.findMany({
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            columnId: true,
          },
        },
      },
    });
  }

  async updateColumn(id: string, data: UpdateColumnDTO): Promise<Column> {
    const column = await this.prisma.column.findUnique({ where: { id } });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    return this.prisma.column.update({
      where: {
        id,
      },
      data,
    });
  }

  async updateColumns(data: (Column & { tasks: Task[] })[]): Promise<Column[]> {
    const columns = await this.prisma.column.findMany({
      where: {
        id: {
          in: data.map((column) => column.id),
        },
      },
    });

    if (columns.length !== data.length) {
      throw new NotFoundException('Column not found');
    }

    const updatedColumns: Column[] = [];

    for (const columnData of data) {
      const { tasks, ...columnDataWithoutTasks } = columnData;

      const column = await this.prisma.column.update({
        where: {
          id: columnData.id,
        },
        data: columnDataWithoutTasks,
      });

      for (const task of tasks) {
        await this.prisma.task.update({
          where: {
            id: task.id,
          },
          data: {
            columnId: column.id,
          },
        });
      }

      updatedColumns.push(column);
    }

    return updatedColumns;
  }

  async deleteColumn(id: string): Promise<Column> {
    const column = await this.prisma.column.findUnique({ where: { id } });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    return this.prisma.column.delete({
      where: {
        id,
      },
    });
  }
}
