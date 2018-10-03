import {Controller, Post, Body, ValidationPipe} from '@nestjs/common';
import { JwtPayloadInterface } from './interfaces';
import {AuthModel, UserModel} from './../models';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body(new ValidationPipe()) auth: AuthModel): Promise<string> {
    return this.authService.authenticate(auth);
  }

  // @Post('/register')
  // async register(@Body(new ValidationPipe()) user: UserModel): Promise<string> {

  // }
}