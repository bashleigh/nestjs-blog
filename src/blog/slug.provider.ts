import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';
const slugify = require('slugify');

@Injectable()
export class SlugProvider {
  constructor(@InjectConfig() private readonly config) {}

  slugify(slug: string): Promise<string> {
    return slugify(slug, this.config.get('slugify'));
  }

  replacement(): string {
    return this.config.get('slugify.replacement');
  }
}
