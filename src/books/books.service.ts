import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { SupabaseStorageService } from '../common/services/supabase-storage.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    private readonly supabaseStorageService: SupabaseStorageService,
  ) {}

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10, search } = query;

    const qb = this.bookRepo.createQueryBuilder('book');

    if (search) {
      qb.andWhere('book.title ILIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async create(dto: CreateBookDto, coverImage?: Express.Multer.File): Promise<Book> {
    let coverImageUrl: string | null = null;
    if (coverImage) {
      const timestamp = Date.now();
      const safeName = coverImage.originalname
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quita acentos
        .replace(/\s+/g, '-')            // espacios a guiones
        .replace(/[^a-zA-Z0-9.-]/g, ''); // solo caracteres seguros

      const filename = `${Date.now()}-${safeName}`;
      coverImageUrl = await this.supabaseStorageService.uploadFile(
        coverImage,
        'book-covers',
        filename,
      );
    }

    const book = this.bookRepo.create({
      title:        dto.title,
      author:       dto.author,
      editor:       dto.editor,
      synopsis:     dto.synopsis,
      adminScore:   dto.adminScore,
      coverImageUrl,
    });

    return this.bookRepo.save(book);
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepo.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Libro no encontrado');
    return book;
  }

  async update(id: number, dto: UpdateBookDto, coverImage?: Express.Multer.File): Promise<Book> {
    const book = await this.findOne(id);

    if (coverImage) {
      const timestamp = Date.now();
      const safeName = coverImage.originalname
        .replace(/\s+/g, '_')             
        .replace(/[^a-zA-Z0-9._-]/g, ''); 

      const filename = `${Date.now()}-${safeName}`;
      book.coverImageUrl = await this.supabaseStorageService.uploadFile(
        coverImage,
        'book-covers',
        filename,
      );
    }

    Object.assign(book, dto);
    return this.bookRepo.save(book);
  }

  async remove(id: number): Promise<Book> {
    const book = await this.findOne(id);
    await this.bookRepo.delete(id);
    return book;
  }

  async contarLibros() {
    const total = await this.bookRepo.count();
    return { total };
  }
}
