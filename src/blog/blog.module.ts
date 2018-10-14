import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './../entities';
import { BlogService } from './blog.service';
import { ConfigModule } from 'nestjs-config';
import { BlogController } from './blog.controller';
import { SlugProvider } from './slug.provider';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([BlogEntity])],
  controllers: [BlogController],
  providers: [SlugProvider, BlogService],
})
export class BlogModule {}
