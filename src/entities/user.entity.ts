import BaseEntity from './base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;
}
