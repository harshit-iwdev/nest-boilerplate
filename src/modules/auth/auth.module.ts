/**
 * AuthModule
 * Encapsulates the authentication domain, importing required external modules 
 * (like Passport and JWT) and registering auth-specific controllers and services.
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // PassportModule provides integration with the passport authentication library
    PassportModule,
    // JwtModule is configured asynchronously to allow injecting the ConfigService
    // and reading the JWT secrets from the environment variables.
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Secret used to sign the tokens
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME') as any, // Token expiration time
        },
      }),
    }),
  ],
  // Controllers exposed by this module
  controllers: [AuthController],
  // Providers (services, strategies, etc.) managed by this module
  providers: [AuthService, JwtStrategy],
  // Export AuthService so it can be used by other modules if necessary
  exports: [AuthService],
})
export class AuthModule { }
