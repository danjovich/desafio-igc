import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '../modules/authentication/authentication.module';
import { ColumnModule } from '../modules/column/column.module';
import { TaskModule } from 'src/modules/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthenticationModule,
    ColumnModule,
    TaskModule,
  ],
})
export class AppModule {}
