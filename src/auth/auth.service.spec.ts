import { INestApplication, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { UserModule, UserService } from '../user';
import { AuthModule } from './auth.module';
import { UserEntity } from '../entities';

describe('AuthService', () => {
  let app: INestApplication;
  let module: TestingModule;
  let authService: AuthService;
  let payload: string;
  let userService: UserService;
  let user: UserEntity;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(path.resolve(__dirname, '../', 'config', '*.ts')),
        TypeOrmModule.forRootAsync({
          useFactory: (config: ConfigService) => config.get('database'),
          inject: [ConfigService],
        }),
        UserModule,
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    authService = module.get(AuthService);
    userService = module.get(UserService);
  });

  it('authenticate fail', async () => {
    let error;
    try {
      await authService.authenticate({
        email: 'no email',
        password: 'df',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(BadRequestException);
  });

  it('authenticate', async () => {
    user = await userService.create({
      email: 'email@email.com',
      password: 'testtest',
      firstname: 'test',
      lastname: 'test',
    });

    payload = await authService.authenticate({
      email: 'email@email.com',
      password: 'testtest',
    });
  });

  it('validateUser', async () => {
    const result = await authService.validateUser(user);
    expect(result).toBeInstanceOf(UserEntity);
  });

  afterAll(async () => {
    await userService.destroy(user.id);
    app.close();
  });
});
