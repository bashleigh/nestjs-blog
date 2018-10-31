import { Controller, Post, Body, ValidationPipe, UnprocessableEntityException } from '@nestjs/common';
import { JwtPayloadInterface } from './interfaces';
import { AuthModel, UserModel } from './../models';
import { AuthService } from './auth.service';
import {UserService} from './../user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body(new ValidationPipe()) auth: AuthModel): Promise<string> {
    return this.authService.authenticate(auth);
  }

  @Post('/register')
  async register(@Body(new ValidationPipe()) userModel: UserModel): Promise<string> {
    const emailExists = await this.userService.findByEmail(userModel.email);
    console.log('email', emailExists);

    if (emailExists) {
      throw new UnprocessableEntityException();
    }

    const user = await this.userService.create(userModel);

    return this.authService.authenticate(user);
  }
}
