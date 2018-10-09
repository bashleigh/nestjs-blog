import {Test, TestingModule} from '@nestjs/testing';
import {UserService, UserModule} from './';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagination } from '../paginate';
import { INestApplication } from '@nestjs/common';

describe('UserService', () => {
  let module: TestingModule;
  let userService: UserService;
  let app: INestApplication;

  beforeEach(async () => {
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

  it('Pagination', async () => {
    expect(await userService.paginate({
      limit: 10,
      page: 0,
    })).toBeInstanceOf(Pagination);
  });

  afterAll(() => app.close());
});