import { Module } from '@nestjs/common';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
  providers: [PrismaService, TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
