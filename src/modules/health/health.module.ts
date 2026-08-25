/**
 * HealthModule
 * A simple module for providing a health check endpoint.
 * Useful for load balancers and container orchestration (like Kubernetes or AWS ECS)
 * to determine if the application is running.
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  // Register the HealthController which defines the health check routes
  controllers: [HealthController],
})
export class HealthModule {}
