/**
 * Knex Database Module
 * Provides a global database connection using the Knex.js query builder.
 */
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

// A constant token used to inject the Knex instance into other services
export const KNEX_CONNECTION = 'KNEX_CONNECTION';

/**
 * The @Global() decorator makes this module globally available,
 * so you don't need to import it into every other module that requires database access.
 */
@Global()
@Module({
  providers: [
    {
      // The provider token that other classes will use to inject this Knex instance
      provide: KNEX_CONNECTION,
      // Inject the ConfigService to access environment variables
      inject: [ConfigService],
      // useFactory creates the provider dynamically using the injected dependencies
      useFactory: async (configService: ConfigService) => {
        // Initialize the Knex instance with PostgreSQL configuration
        const instance = knex({
          client: 'pg', // Specifies PostgreSQL as the database client
          connection: {
            host: configService.get<string>('DB_HOST'), // Database host from .env
            port: configService.get<number>('DB_PORT'), // Database port from .env
            user: configService.get<string>('DB_USER'), // Database user from .env
            password: configService.get<string>('DB_PASSWORD'), // Database password from .env
            database: configService.get<string>('DB_NAME'), // Database name from .env
          },
          // Configure the connection pool to manage database connections efficiently
          pool: {
            min: 2, // Minimum number of connections in the pool
            max: 10, // Maximum number of connections in the pool
          },
        });
        // Return the initialized Knex instance to be used throughout the app
        return instance;
      },
    },
  ],
  // Export the provider token so it can be used outside this module
  exports: [KNEX_CONNECTION],
})
export class KnexDatabaseModule {}
