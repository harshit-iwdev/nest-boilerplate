/**
 * Custom Decorator: @CurrentUser()
 * Extracts the authenticated user object from the request.
 * Useful in controllers to directly access user data attached by the JwtStrategy.
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Switch the context to HTTP to access the underlying Express request object
    const request = ctx.switchToHttp().getRequest();
    // Return the 'user' object that was attached to the request by the AuthGuard
    return request.user;
  },
);
