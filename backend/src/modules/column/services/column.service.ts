import { Injectable, NotFoundException } from '@nestjs/common';
import { Column, Task } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';
import CreateColumnDTO from '../dtos/CreateColumnDTO';
import UpdateColumnDTO from '../dtos/UpdateColumnDTO';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io-client';

@Injectable()
@WebSocketGateway({ cors: true })
export class ColumnService {
  constructor(private prisma: PrismaService) {}

  @WebSocketServer() server: Socket;

  async createColumn(data: CreateColumnDTO): Promise<Column> {
    const columns = await this.prisma.column.create({
      data,
    });

    this.server.emit('reload');

    return columns;
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

    const updatedColumn = await this.prisma.column.update({
      where: {
        id,
      },
      data,
    });

    const previousColumn = column;

    await this.updateColumnHistory(id, previousColumn, updatedColumn);

    this.server.emit('reload');

    return updatedColumn;
  }

  private async updateColumnHistory(
    columnId: string,
    previousColumn: Column,
    updatedColumn: Column,
  ): Promise<void> {
    if (previousColumn.title !== updatedColumn.title) {
      await this.prisma.columnHistory.create({
        data: {
          columnId,
          changedField: 'title',
          oldValue: previousColumn.title,
          newValue: updatedColumn.title,
        },
      });
    }
  }

  private async updateTaskHistory(
    taskId: string,
    previousColumnId: string,
    updatedColumnId: string,
  ): Promise<void> {
    if (previousColumnId !== updatedColumnId) {
      await this.prisma.taskHistory.create({
        data: {
          taskId,
          changedField: 'columnId',
          oldValue: previousColumnId,
          newValue: updatedColumnId,
        },
      });
    }
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

      const previousColumn = columns.find((c) => c.id === column.id);

      if (previousColumn) {
        await this.updateColumnHistory(column.id, previousColumn, column);
      }

      for (const task of tasks) {
        const previousTask = await this.prisma.task.findUnique({
          where: { id: task.id },
        });

        if (previousTask) {
          await this.prisma.task.update({
            where: {
              id: task.id,
            },
            data: {
              columnId: column.id,
            },
          });

          await this.updateTaskHistory(
            task.id,
            previousTask.columnId,
            column.id,
          );
        }
      }

      updatedColumns.push(column);
    }

    this.server.emit('reload');

    return updatedColumns;
  }

  async deleteColumn(id: string): Promise<Column> {
    const column = await this.prisma.column.findUnique({ where: { id } });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    this.server.emit('reload');

    return this.prisma.column.delete({
      where: {
        id,
      },
    });
  }
}
