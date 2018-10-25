import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { BlogEntity } from './../entities';
import { Pagination, PaginationOptionsInterface } from './../paginate';
import { SlugProvider } from './slug.provider';
import { BlogModel } from './../models';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly slugProvider: SlugProvider,
  ) {}

  async paginate(
    options: PaginationOptionsInterface,
  ): Promise<Pagination<BlogEntity>> {
    const [results, total] = await this.blogRepository.findAndCount({
      take: options.limit,
      skip: options.page, // think this needs to be page * limit
    });

    // TODO add more tests for paginate

    return new Pagination<BlogEntity>({
      results,
      total,
    });
  }

  async create(blog: BlogModel): Promise<BlogEntity> {
    blog = await this.uniqueSlug(blog);
    return await this.blogRepository.save(this.blogRepository.create(blog));
  }

  async update(blog: BlogEntity): Promise<UpdateResult> {
    return await this.blogRepository.update(blog.id, blog);
  }

  async findById(id: number): Promise<BlogEntity | null> {
    return await this.blogRepository.findOne(id);
  }

  async findBySlug(slug: string): Promise<BlogEntity | null> {
    return await this.blogRepository.findOne({
      where: {
        slug,
      },
    });
  }

  async destroy(id: number): Promise<DeleteResult> {
    return await this.blogRepository.delete(id);
  }

  async uniqueSlug(blog: BlogModel): Promise<BlogModel> {
    blog.slug = await this.slugProvider.slugify(blog.title);
    const exists = await this.findSlugs(blog.slug);

    // if slug doesn't already exists
    if (!exists || exists.length === 0) {
      return blog;
    }

    // Omit if same entity
    if (exists.length === 1 && blog.id === exists[0].id) {
      return blog;
    }

    // Add to suffix
    blog.slug = blog.slug + this.slugProvider.replacement() + exists.length;

    return blog;
  }

  private async findSlugs(slug: string): Promise<BlogEntity[]> {
    return await this.blogRepository
      .createQueryBuilder('blog')
      .where('slug like :slug', { slug: `${slug}%` })
      .getMany();
  }
}
