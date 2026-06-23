import { IsArray, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  author!: string;

  @IsNotEmpty()
  @IsString()
  editor!: string;

  @IsNotEmpty()
  @IsString()
  synopsis!: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(5)
  adminScore!: number;

  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map(Number);
    if (typeof value === 'string') return value.split(',').map(Number);
    return [];
  })
  @IsArray()
  @IsInt({ each: true })
  genreIds!: number[];
}
