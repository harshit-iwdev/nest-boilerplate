/**
 * AppController
 * A basic controller acting as a root endpoint handler.
 */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // Inject the AppService
  constructor(private readonly appService: AppService) {}

  /**
   * A simple root endpoint to verify the app is reachable.
   */
  @Get()
  getHello(): string {
    // Delegate to the AppService
    return this.appService.getHello();
  }
}
