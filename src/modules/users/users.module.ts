/**
 * UsersModule
 * Encapsulates the user domain, including user-related controllers and services.
 */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  // Controllers exposed by this module
  controllers: [UsersController],
  // Providers (services) managed by this module
  providers: [UsersService],
  // Export UsersService so other modules (like AuthModule) can inject it if needed
  exports: [UsersService],
})
export class UsersModule {}
