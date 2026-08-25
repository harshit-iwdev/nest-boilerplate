/**
 * Data Transfer Object (DTO) for User Registration.
 * Defines the expected structure, validation rules, and Swagger documentation
 * for the incoming payload when a new user registers.
 */
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  /**
   * The user's email address.
   * Validated to ensure it is not empty and follows a valid email format.
   */
  @ApiProperty({ example: 'user@example.com', description: 'The email address of the user' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  /**
   * The user's password.
   * Validated to ensure it is a string, not empty, and has a minimum length.
   */
  @ApiProperty({ example: 'StrongPassword123!', minLength: 6, description: 'The password for the user account' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  /**
   * The user's full name.
   * Validated to ensure it is a non-empty string.
   */
  @ApiProperty({ example: 'John Doe', description: 'The full name of the user' })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;
}
