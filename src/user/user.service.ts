import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { UserEntity as User, UserEntity } from './../entities';
import { Pagination, PaginationOptionsInterface } from './../paginate';
import { UserModel } from 'models';
import * as bcrypt from 'bcrypt';
import { InjectConfig, ConfigService } from 'nestjs-config';

@Injectable()
export class UserService {
  private saltRounds: number;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectConfig() private readonly config: ConfigService,
  ) {
    this.saltRounds = config.get('app.salt_rounds', 10);
  }

  async paginate(
    options: PaginationOptionsInterface,
  ): Promise<Pagination<User>> {
    const [results, total] = await this.userRepository.findAndCount({
      take: options.limit,
      skip: options.page, // think this needs to be page * limit
    });

    // TODO add more tests for paginate

    return new Pagination<User>({
      results,
      total,
    });
  }

  async create(user: UserModel): Promise<User> {
    user.password = await this.getHash(user.password);

    const result = await this.userRepository.save(
      this.userRepository.create(user),
    );

    delete result.password;
    return result;
  }

  async update(user: UserEntity): Promise<UpdateResult> {
    return await this.userRepository.update(user.id, user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOneOrFail(id);
  }

  async getHash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async findByEmailWithPassword(email: string): Promise<User> | null {
    return await this.userRepository.findOne(
      {
        email,
      },
      {
        select: ['email', 'password'],
      },
    );
  }

  async destroy(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
