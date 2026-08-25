/**
 * Root Application Module for the NestJS boilerplate.
 * This module aggregates all other modules, database configurations, and global providers.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './config/env.validation';

// --- Import Database Modules ---
// Depending on the chosen ORM/Query Builder, only one should typically be active.
import { KnexDatabaseModule } from './database/knex/knex.module';
// import { SequelizeDatabaseModule } from './database/sequelize/sequelize.module';
// import { TypeOrmDatabaseModule } from './database/typeorm/typeorm.module';

// --- Import Application Modules ---
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';

/**
 * The @Module decorator provides metadata that Nest makes use of to organize the application structure.
 */
@Module({
  // 'imports' array registers other modules that are required by this module
  imports: [
    // ConfigModule is initialized globally to load environment variables from the .env file.
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config available globally without needing to import it in every module
      validationSchema: envValidationSchema, // Validates env variables against the Joi schema
      envFilePath: ['.env'], // Specifies the path to the environment variable file
    }),

    // --- DB CONNECTIONS ---
    // Registers the database connection module. 
    // You can swap this with SequelizeDatabaseModule or TypeOrmDatabaseModule by uncommenting.
    KnexDatabaseModule, // Default query builder used in this boilerplate
    // SequelizeDatabaseModule, // Sequelize ORM implementation
    // TypeOrmDatabaseModule, // TypeORM implementation

    // --- DOMAIN MODULES ---
    // Features and endpoints are encapsulated inside these modules.
    AuthModule, // Handles user authentication, JWT signing, and guards
    UsersModule, // Manages user data, profiles, and database interactions related to users
    HealthModule, // Exposes endpoints to check the application's health status
  ],
  // 'controllers' array defines the controllers instantiated within this module (handling incoming requests)
  controllers: [AppController],
  // 'providers' array defines the services that will be instantiated by the Nest injector and may be shared across this module
  providers: [AppService],
})
export class AppModule {}
