/**
 * TypeORM Database Module
 * Provides a global database connection using TypeORM.
 */
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * The @Global() decorator makes the TypeOrmModule globally accessible.
 */
@Global()
@Module({
  imports: [
    // forRootAsync allows for dynamic configuration by injecting dependencies like ConfigService
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // Inject ConfigService to read from .env
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Specifies PostgreSQL as the database type
        host: configService.get<string>('DB_HOST'), // Database host
        port: configService.get<number>('DB_PORT'), // Database port
        username: configService.get<string>('DB_USER'), // Database username
        password: configService.get<string>('DB_PASSWORD'), // Database password
        database: configService.get<string>('DB_NAME'), // Database name
        autoLoadEntities: true, // Automatically loads all registered entities without having to specify them individually
        // synchronize automatically syncs the DB schema with the entities.
        // WARNING: Should be false in production to prevent accidental data loss.
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: false, // Disables query logging to the console
      }),
    }),
  ],
  // Export TypeOrmModule so other modules can use TypeORM features like TypeOrmModule.forFeature()
  exports: [TypeOrmModule],
})
export class TypeOrmDatabaseModule {}
