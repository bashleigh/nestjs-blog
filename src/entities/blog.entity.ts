import BaseEntity from './base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({
    unique: true,
  })
  slug: string;

  @Column()
  content: string;

  @Column({})
  published: boolean = false;

  @Column({
    type: Date,
    nullable: true,
  })
  publish_at: Date | null;
}
