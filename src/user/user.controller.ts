import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  ValidationPipe,
  UnprocessableEntityException,
  Param,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { UserEntity } from './../entities';
import { Pagination } from './../paginate';
import { UserService } from './user.service';
import { UserModel } from './../models';
import { UpdateResult } from 'typeorm';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async index(@Request() request): Promise<Pagination<UserEntity>> {
    // TODO make PaginationOptionsInterface an object so it can be defaulted
    return await this.userService.paginate({
      limit: request.query.hasOwnProperty('limit') ? request.query.limit : 10,
      page: request.query.hasOwnProperty('page') ? request.query.page : 0,
    });
  }

  @Post()
  async store(
    @Body(new ValidationPipe()) user: UserModel,
  ): Promise<UserEntity> {
    const emailExists = await this.userService.findByEmail(user.email);

    if (emailExists) {
      throw new UnprocessableEntityException();
    }

    return await this.userService.create(user);
  }

  @Put('/{id}')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) user: UserModel,
  ): Promise<UpdateResult> {
    const userEntity = await this.userService.findById(id);

    if (!userEntity) {
      throw new NotFoundException();
    }

    return await this.userService.update({
      ...userEntity,
      ...user,
    });
  }

  @Get('/{id}')
  async show(@Param('id') id: number): Promise<UserEntity> {
    const user = this.userService.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
