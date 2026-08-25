import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { KNEX_CONNECTION } from '../../database/knex/knex.module';
import { Knex } from 'knex';

@Injectable()
export class UsersService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
  ) {}

  async findById(userId: number) {
    const user = await this.knex('users').where({ id: userId }).first();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Don't return password
    delete user.password;
    return user;
  }
}
