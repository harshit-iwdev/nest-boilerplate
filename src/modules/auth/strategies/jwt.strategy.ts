/**
 * JwtStrategy
 * A Passport strategy used to validate incoming JWTs attached to requests.
 */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // Configure the strategy behavior
    super({
      // Extract the JWT from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Ensure the strategy rejects expired tokens
      ignoreExpiration: false,
      // Provide the secret key used to verify the token signature
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret',
    });
  }

  /**
   * The validate method is called after the token signature and expiration are verified.
   * @param payload The decoded JSON payload from the token
   */
  async validate(payload: any) {
    // If the payload is empty, deny access
    if (!payload) {
      throw new UnauthorizedException();
    }
    // Return the formatted user object.
    // Passport will attach this object to the request object (req.user)
    return { userId: payload.sub, email: payload.email };
  }
}
