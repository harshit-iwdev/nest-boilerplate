/**
 * JwtAuthGuard
 * A global route guard that enforces JWT authentication across the application.
 */
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super(); // Initialize the base passport AuthGuard for 'jwt' strategy
  }

  /**
   * Determines if the current request is allowed to proceed.
   */
  canActivate(context: ExecutionContext) {
    // Use Reflector to check if the route handler or class has the @Public() decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // If it's a public route, bypass JWT authentication completely
    if (isPublic) {
      return true;
    }
    // Otherwise, fallback to the standard passport-jwt authentication process
    return super.canActivate(context);
  }

  /**
   * Hook to handle the result of the authentication strategy.
   * Allows custom error handling if authentication fails.
   */
  handleRequest(err, user, info) {
    // Throw an Unauthorized exception if an error occurred or no user was extracted
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    // Return the authenticated user object, which will be attached to req.user
    return user;
  }
}
