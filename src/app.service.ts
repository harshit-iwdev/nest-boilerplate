/**
 * AppService
 * A basic service providing simple business logic for the root controller.
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns a greeting string.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
