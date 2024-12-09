import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '../modules/authentication/authentication.module';
import { ColumnModule } from '../modules/column/column.module';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthenticationModule,
    ColumnModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
