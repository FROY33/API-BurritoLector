import { AffinityBookDto } from './affinity-book.dto';

export class AffinityResponseDto {
  affinity!: number;
  commonBooks!: AffinityBookDto[];
  totalCommonBooks!: number;
  booksWithSimilarTaste!: number;
}
