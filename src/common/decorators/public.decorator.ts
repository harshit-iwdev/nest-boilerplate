/**
 * Custom Decorator: @Public()
 * Used to bypass the global JWT authentication guard for specific routes.
 * Endpoints decorated with @Public() do not require a valid bearer token.
 */
import { SetMetadata } from '@nestjs/common';

// A unique constant key to store the public metadata state
export const IS_PUBLIC_KEY = 'isPublic';

// The Public decorator assigns true to the IS_PUBLIC_KEY metadata
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
