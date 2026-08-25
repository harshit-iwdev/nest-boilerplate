/**
 * AuthController
 * Handles incoming HTTP requests related to authentication, such as login and registration.
 */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * @ApiTags groups endpoints in Swagger UI.
 * @Controller maps routes starting with /auth to this class.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  // Inject the AuthService to handle business logic
  constructor(private readonly authService: AuthService) { }

  /**
   * Endpoint to register a new user.
   * @Public() allows access without a valid JWT token.
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  register(@Body() registerDto: RegisterDto) {
    // Delegates the registration process to the AuthService
    return this.authService.register(registerDto);
  }

  /**
   * Endpoint to login and receive a JWT token.
   * @Public() allows access without a valid JWT token.
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiResponse({ status: 200, description: 'Returns JWT token and user info.' })
  login(@Body() loginDto: LoginDto) {
    // Delegates the login process to the AuthService
    return this.authService.login(loginDto);
  }
}
