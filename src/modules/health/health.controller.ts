/**
 * HealthController
 * Exposes a public endpoint to check the application's health status.
 */
import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

/**
 * @ApiTags groups this endpoint under "Health" in Swagger UI.
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  /**
   * The actual health check endpoint.
   * @Public() ensures this route can be accessed without a JWT token.
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Check API Health' })
  check() {
    // Return a simple JSON payload indicating the server is alive
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
