/**
 * Data Transfer Object (DTO) for User Login.
 * Defines the expected payload structure and validation rules for authentication.
 */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  /**
   * The registered email address of the user.
   */
  @ApiProperty({ example: 'user@example.com', description: 'The registered email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  /**
   * The user's password.
   */
  @ApiProperty({ example: 'StrongPassword123!', description: 'The user password' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
