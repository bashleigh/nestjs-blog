import { Test, TestingModule } from '@nestjs/testing';
import { BlogService, BlogModule } from './';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import { TypeOrmModule, getConnectionToken } from '@nestjs/typeorm';
import { Pagination } from '../paginate';
import { INestApplication } from '@nestjs/common';
import { BlogEntity } from '../entities';
import { UpdateResult, DeleteResult, Connection } from 'typeorm';

describe('BlogService', () => {
  let app: INestApplication;
  let module: TestingModule;
  let blogService: BlogService;
  let blog: BlogEntity;
  const blogs: BlogEntity[] = [];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(path.resolve(__dirname, '../', 'config', '*.ts')),
        TypeOrmModule.forRootAsync({
          useFactory: (config: ConfigService) => config.get('database'),
          inject: [ConfigService],
        }),
        BlogModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    blogService = module.get(BlogService);
  });

  it('paginate', async () => {
    expect(
      await blogService.paginate({
        limit: 10,
        page: 0,
      }),
    ).toBeInstanceOf(Pagination);
  });

  it('create', async () => {
    expect(
      (blog = await blogService.create({
        title: 'test',
        content: '#Content',
      })),
    ).toBeInstanceOf(BlogEntity);
  });

  it('update', async () => {
    blog.content = '#Conent Updated';

    const result = await blogService.update(blog);

    expect(result).toBeInstanceOf(UpdateResult);
  });

  it('delete', async () => {
    const result = await blogService.destroy(blog.id);
    expect(result).toBeInstanceOf(DeleteResult);
  });

  it('uniqueSlug', async () => {

    let sluggedBlog: BlogEntity;

    sluggedBlog = await blogService.uniqueSlug({
      title: 'hello',
      content: 'test',
    });

    expect(sluggedBlog.slug).toBe('hello');

    sluggedBlog = await blogService.uniqueSlug({
      title: 'I have spaces',
      content: 'test',
    });

    expect(sluggedBlog.slug).toBe('i-have-spaces');

    blogs.push(
      await blogService.create({
        title: 'title',
        content: 'test',
      }),
    );

    blogs.push(
      await blogService.create({
        title: 'title',
        content: 'test',
      }),
    );

    expect(blogs[blogs.length - 1].slug).toEqual('title-1');
  });

  afterAll(async () => {
    const connection = module.get<Connection>(getConnectionToken('default'));
    await connection.query('TRUNCATE blog_entity');
    app.close();
  });
});
