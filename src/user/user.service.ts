import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import {UserEntity as User, UserEntity} from './../entities';
import { Pagination, PaginationOptionsInterface } from './../paginate';
import { UserModel } from 'models';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async paginate(options: PaginationOptionsInterface): Promise<Pagination<User>> {
        const [results, total] = await this.userRepository.findAndCount({
            take: options.take,
            skip: options.page,
        });

        return new Pagination<User>({
            results,
            total,
        });
    }

    async create(user: UserModel): Promise<User> {
        return await this.userRepository.save(this.userRepository.create(user));
    }

    async update(user: UserEntity): Promise<UpdateResult> {
        return await this.userRepository.update(user.id, user);
    }

    async findByEmail(email: string): Promise<User|null> {
        return await this.userRepository.findOne({
            where: {
                email,
            },
        });
    }
}