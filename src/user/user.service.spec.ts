import { Test, TestingModule } from '@nestjs/testing';
import { UserService, UserModule } from './';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagination } from '../paginate';
import { INestApplication } from '@nestjs/common';
import { UserEntity } from '../entities';
import { UpdateResult, DeleteResult } from 'typeorm';

describe('UserService', () => {
  let module: TestingModule;
  let userService: UserService;
  let app: INestApplication;
  let user: UserEntity;
  let auth: Partial<UserEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(path.resolve(__dirname, '../', 'config', '*.ts')),
        TypeOrmModule.forRootAsync({
          useFactory: (config: ConfigService) => config.get('database'),
          inject: [ConfigService],
        }),
        UserModule,
      ],
    }).compile();

    app = await module.createNestApplication();

    userService = module.get(UserService);
  });

  it('paginate', async () => {
    expect(
      await userService.paginate({
        limit: 10,
        page: 0,
      }),
    ).toBeInstanceOf(Pagination);
  });

  it('create', async () => {
    const number = Math.floor(Math.random() * Math.floor(20));
    expect(
      (user = await userService.create({
        email: `test${number}@test.com`,
        firstname: 'test',
        lastname: 'test',
        password: 'password',
      })),
    ).toBeInstanceOf(UserEntity);
    expect(user).not.toHaveProperty('password');
  });

  it('Update', async () => {
    user.firstname = 'updated';

    const result = await userService.update(user);
    expect(result).toBeInstanceOf(UpdateResult);
    expect(user.firstname).toEqual('updated');
  });

  it('findByEmailWithPassword', async () => {
    auth = await userService.findByEmailWithPassword(user.email);

    expect(auth).toHaveProperty('password');
  });

  it('CompareHash', async () => {
    const result = await userService.compareHash('password', auth.password);

    expect(result).toBeTruthy();
  });

  it('findByEmail', async () => {
    const result = await userService.findByEmail(user.email);

    expect(result).toBeInstanceOf(UserEntity);

    delete user.updated;

    expect(result).toEqual(expect.objectContaining(user));
  });

  it('findById', async () => {
    const result = await userService.findById(user.id);

    expect(result).toBeInstanceOf(UserEntity);
    expect(result).toEqual(expect.objectContaining(user));
  });

  it('delete', async () => {
    const result = await userService.destroy(user.id);
    expect(result).toBeInstanceOf(DeleteResult);
  });

  afterAll(async () => app.close());
});
