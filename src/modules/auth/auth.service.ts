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
    private jwtService: JwtService,
    // Injecting Knex for demonstration. In a real app, this might be a UserRepository
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
  ) { }

  async register(registerDto: RegisterDto) {
    try {
      const { email, password, name } = registerDto;

      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save user using Knex
      // This assumes a 'users' table exists. 
      const [user] = await this.knex('users').insert({
        email,
        password: hashedPassword,
        name,
      }).returning(['id', 'email', 'name']);

      return user;
    } catch (error) {
      if (error.code === '23505') { // Postgres unique violation code
        throw new UnauthorizedException('Email already exists');
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.knex('users').where({ email }).first();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
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
