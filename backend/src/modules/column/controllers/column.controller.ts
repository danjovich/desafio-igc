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
import { ColumnService } from '../services/column.service';
import CreateColumnDTO from '../dtos/CreateColumnDTO';
import UpdateColumnDTO from '../dtos/UpdateColumnDTO';

@Controller('columns')
export class ColumnController {
  constructor(private columnService: ColumnService) {}

  @Post()
  async createColumn(@Body() { title }: CreateColumnDTO) {
    return this.columnService.createColumn({
      title,
    });
  }

  @Get()
  async getColumns() {
    return this.columnService.getColumns();
  }

  @Put(':id')
  async updateColumn(
    @Param('id') id: string,
    @Body() { title }: UpdateColumnDTO,
  ) {
    return this.columnService.updateColumn(id, { title });
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteColumn(@Param('id') id: string) {
    await this.columnService.deleteColumn(id);
  }
}
