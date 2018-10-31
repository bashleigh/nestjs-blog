import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Request,
  NotFoundException,
  Body,
  ValidationPipe,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { BlogEntity } from './../entities';
import { Pagination } from './../paginate';
import { BlogService } from './blog.service';
import { BlogModel } from './../models';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async index(@Request() request): Promise<Pagination<BlogEntity>> {
    return await this.blogService.paginate({
      limit: request.query.hasOwnProperty('limit') ? request.query.limit : 10,
      page: request.query.hasOwnProperty('page') ? request.query.page : 0,
    });
  }

  @Get('/{slug}')
  async show(@Param('slug') slug: string): Promise<BlogEntity> {
    const blog = await this.blogService.findBySlug(slug);

    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) body: BlogModel,
  ): Promise<BlogEntity> {
    const exists = await this.blogService.findBySlug(body.slug);

    if (exists) {
      throw new UnprocessableEntityException();
    }

    return await this.blogService.create(body);
  }

  @Put('/{id}')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) body: BlogModel,
  ): Promise<UpdateResult> {
    const blog = await this.blogService.findById(body.id);

    if (!blog) {
      throw new NotFoundException();
    }

    return await this.blogService.update({
      ...blog,
      ...body,
    });
  }
}
