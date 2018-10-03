import { Module } from '@nestjs/common';
import { UserEntity } from './../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from 'nestjs-config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
