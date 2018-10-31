import { Test, TestingModule } from '@nestjs/testing';
import {SlugProvider} from './slug.provider';
import {ConfigModule, ConfigService} from 'nestjs-config';
import * as path from 'path';
import { INestApplication } from '@nestjs/common';

let module: TestingModule;
let app: INestApplication;
let slugProvider: SlugProvider;
let config: ConfigService;

describe('SlugProvider', async () => {
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(path.resolve(__dirname, '../', 'config', '*.ts')),
      ],
      providers: [SlugProvider],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    slugProvider = module.get(SlugProvider);
    config = module.get(ConfigService);
  });

  it('replacement', () => {
    expect(slugProvider.replacement()).toEqual(config.get('slugify.replacement'));
  });

  it('slugify', () => {
    expect(slugProvider.slugify('test test')).toEqual('test-test');
  });
});
