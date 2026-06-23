import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column()
  editor!: string;

  @Column('text')
  synopsis!: string;

  @Column({ type: 'int' })
  adminScore!: number;

  @Column({ nullable: true, type: 'varchar' })
  coverImageUrl!: string | null;

  @Column({ type: 'float', default: 0 })
  communityScore!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
