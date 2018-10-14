import { IsString, IsDate } from 'class-validator';

export class BlogModel {
  readonly id: number;

  slug: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsDate()
  publish_at?: Date;
}
