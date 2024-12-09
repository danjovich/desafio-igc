import { Module } from '@nestjs/common';
import { ColumnService } from './services/column.service';
import { ColumnController } from './controllers/column.controller';

@Module({
  providers: [ColumnService],
  controllers: [ColumnController],
})
export class ColumnModule {}
