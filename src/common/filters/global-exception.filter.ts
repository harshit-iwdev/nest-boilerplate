/**
 * Global Exception Filter to handle all unhandled exceptions across the application.
 * This ensures that every error sent to the client follows a consistent, standardized format.
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * @Catch() decorator without arguments means this filter will catch all exceptions
 * (both HttpException and unexpected generic Error objects).
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  // Initialize a logger instance specific to this class
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * The catch method is invoked whenever an exception is thrown in the app.
   * @param exception The caught exception object
   * @param host ArgumentsHost provides access to the request and response objects
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // Switch the context to HTTP to extract request and response objects
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine the HTTP status code:
    // If it's a known HttpException, use its status code; otherwise, default to 500 (Internal Server Error)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract the error message:
    // If it's an HttpException, get its predefined response payload; otherwise, use a generic message
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Log the error details internally for debugging purposes, including the stack trace if available
    this.logger.error(
      `HTTP Status: ${status} Error Message: ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : '',
    );

    // Format and send the standardized JSON response back to the client
    response.status(status).json({
      success: false, // Indicates the request failed
      statusCode: status, // HTTP status code
      timestamp: new Date().toISOString(), // Time of the error
      path: request.url, // The endpoint that caused the error
      // Normalize the message structure (NestJS validation errors are usually objects)
      message: typeof message === 'object' && 'message' in message ? (message as any).message : message,
    });
  }
}
