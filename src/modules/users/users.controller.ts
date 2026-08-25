/**
 * UsersController
 * Handles incoming HTTP requests for user-related endpoints.
 * By default, all routes in this controller are protected by JwtAuthGuard.
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

/**
 * @ApiTags groups endpoints in Swagger UI under "Users"
 * @ApiBearerAuth indicates these endpoints require a Bearer token in Swagger
 * @UseGuards applies the JWT authentication guard to all endpoints in this controller
 */
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  // Inject the UsersService to handle business logic
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint to get the currently authenticated user's profile.
   * @param user The user object extracted from the JWT token via the @CurrentUser decorator.
   */
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: any) {
    // Delegates to the service to fetch full user details from the database
    return this.usersService.findById(user.userId);
  }
}
