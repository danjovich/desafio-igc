import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import CreateTaskDTO from '../dtos/CreateTaskDTO';
import UpdateTaskDTO from '../dtos/UpdateTaskDTO';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  async createTask(
    @Body()
    { title, description, priority, responsible, columnId }: CreateTaskDTO,
  ) {
    return this.taskService.createTask({
      title,
      description,
      priority,
      responsible,
      columnId,
    });
  }

  @Get()
  async getTasks() {
    return this.taskService.getTasks();
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    return this.taskService.getTask(id);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body()
    { title, description, priority, responsible, columnId }: UpdateTaskDTO,
  ) {
    return this.taskService.updateTask(id, {
      title,
      description,
      priority,
      responsible,
      columnId,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTask(@Param('id') id: string) {
    await this.taskService.deleteTask(id);
  }
}
