/**
 * AppController
 * A basic controller acting as a root endpoint handler.
 */
import { Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@ApiTags('App')
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

  /**
   * Endpoint to upload a file.
   * Protected by JWT authentication.
   */
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: any) {
    return { message: 'file uploaded' };
  }
}
