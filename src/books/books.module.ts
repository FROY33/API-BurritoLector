import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { SupabaseStorageService } from '../common/services/supabase-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService, SupabaseStorageService],
  exports: [BooksService],
})
export class BooksModule {}
