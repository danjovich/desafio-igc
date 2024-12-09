import { Module } from '@nestjs/common';
import { ColumnService } from './services/column.service';
import { ColumnController } from './controllers/column.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
  providers: [PrismaService, ColumnService],
  controllers: [ColumnController],
})
export class ColumnModule {}
