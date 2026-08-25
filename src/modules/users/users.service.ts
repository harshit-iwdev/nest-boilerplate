/**
 * UsersService
 * Contains the business logic and database interactions for user entities.
 */
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { KNEX_CONNECTION } from '../../database/knex/knex.module';
import { Knex } from 'knex';

@Injectable()
export class UsersService {
  constructor(
    // Inject the global Knex database connection instance
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
  ) {}

  /**
   * Retrieves a user by their ID from the database.
   * @param userId The ID of the user to fetch.
   */
  async findById(userId: number) {
    // Execute a query to find the first user matching the ID
    const user = await this.knex('users').where({ id: userId }).first();
    
    // If no user is found, throw a 404 Not Found exception
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove the password field from the returned object for security reasons
    delete user.password;
    
    // Return the sanitized user object
    return user;
  }
}
