import { Injectable } from '@nestjs/common';
import { UserService } from 'user';
import { UserEntity } from 'entities';
import { JwtPayloadInterface } from './interfaces';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(payload: JwtPayloadInterface): Promise<UserEntity | null> {
    return await this.userService.findById(payload.id);
  }
}
