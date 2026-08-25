/**
 * Main application entry point for the NestJS boilerplate.
 * This file bootstraps the application, configures global middlewares, pipes, 
 * interceptors, filters, and sets up Swagger for API documentation.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

/**
 * Bootstrap function initializes the NestJS application instance.
 * It is marked async because NestFactory.create returns a Promise.
 */
async function bootstrap() {
  // Create a new NestJS application instance based on the root AppModule
  const app = await NestFactory.create(AppModule);

  // --- Security Middleware Configuration ---
  // Helmet helps secure the app by setting various HTTP headers
  app.use(helmet());
  // Enable Cross-Origin Resource Sharing (CORS) to allow requests from other domains
  app.enableCors();

  // --- Global Pipes, Filters & Interceptors Configuration ---
  
  // Apply a global ValidationPipe to all incoming requests.
  // This ensures that all incoming payloads are validated against their respective DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically strip non-whitelisted properties from the DTOs
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
    }),
  );
  
  // Apply the GlobalExceptionFilter to catch all unhandled exceptions
  // and return a standardized JSON error response.
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Apply the TransformInterceptor to structure all successful responses
  // into a standardized format { success, message, data }.
  app.useGlobalInterceptors(new TransformInterceptor());

  // --- Swagger API Documentation Configuration ---
  
  // Create a configuration builder for Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('NestJS Boilerplate API') // Set the title of the API documentation
    .setDescription('Standard NestJS backend template API documentation') // Set the description
    .setVersion('1.0') // Set the API version
    .addBearerAuth() // Enable Bearer Token Authentication in Swagger UI
    .build();
    
  // Generate the OpenAPI document from the application and configuration
  const document = SwaggerModule.createDocument(app, config);
  // Setup Swagger UI at the '/api-docs' endpoint
  SwaggerModule.setup('api-docs', app, document);

  // Determine the port to run the application on, defaulting to 3000
  const port = process.env.PORT || 3000;
  
  // Start listening for incoming HTTP requests on the specified port
  await app.listen(port);
  
  // Log the application URL after successful startup
  console.log(`Application is running on: http://localhost:${port}`);
}

// Execute the bootstrap function to start the application
bootstrap();
