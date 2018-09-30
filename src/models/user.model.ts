import { IsEmail, IsString } from 'class-validator';

export class UserModel {
  readonly id: number;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;
}
