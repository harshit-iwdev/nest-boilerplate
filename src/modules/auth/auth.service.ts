/**
 * AuthService
 * Contains the core business logic for user authentication (registration, login, hashing).
 */
import { Injectable, UnauthorizedException, Inject, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { KNEX_CONNECTION } from '../../database/knex/knex.module';
import { Knex } from 'knex';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    // JwtService is used to sign and issue JWT tokens
    private jwtService: JwtService,
    // Inject the Knex DB connection using the custom token
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
  ) { }

  /**
   * Registers a new user into the system.
   * @param registerDto Contains email, password, and name.
   */
  async register(registerDto: RegisterDto) {
    try {
      const { email, password, name } = registerDto;

      // Generate a salt and hash the plaintext password securely
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert the new user record into the 'users' table using Knex
      // .returning() specifies the columns to return after insertion (PostgreSQL specific)
      const [user] = await this.knex('users').insert({
        email,
        password: hashedPassword,
        name,
      }).returning(['id', 'email', 'name']);

      // Return the created user object
      return user;
    } catch (error) {
      // Postgres error code 23505 represents a unique constraint violation (e.g., email exists)
      if (error.code === '23505') { 
        throw new UnauthorizedException('Email already exists');
      }
      // Re-throw any other unexpected errors as a 500 Internal Server Error
      throw new InternalServerErrorException('Registration failed');
    }
  }

  /**
   * Authenticates a user and issues a JWT token.
   * @param loginDto Contains email and password.
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Retrieve the user record from the database based on the provided email
    const user = await this.knex('users').where({ email }).first();

    // If the user is not found, throw an Unauthorized exception
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare the provided plaintext password against the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the passwords do not match, throw an Unauthorized exception
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Prepare the payload for the JWT token
    const payload = { email: user.email, sub: user.id };
    
    // Sign the token and return it along with basic user information
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }
}
