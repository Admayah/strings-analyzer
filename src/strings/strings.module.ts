import { Module } from '@nestjs/common';
import { StringsService } from './strings.service';
import { StringsController } from './strings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StringEntity } from './entities/string.entities';

@Module({
  imports: [TypeOrmModule.forFeature([StringEntity])],
  providers: [StringsService],
  controllers: [StringsController],
  exports: [StringsService],
})
export class StringsModule { }
