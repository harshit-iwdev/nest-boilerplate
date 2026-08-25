/**
 * Sequelize Database Module
 * Provides a global database connection using the Sequelize ORM.
 */
import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

/**
 * The @Global() decorator makes this module globally accessible across the application.
 */
@Global()
@Module({
  imports: [
    // forRootAsync allows configuring Sequelize asynchronously by injecting services
    SequelizeModule.forRootAsync({
      inject: [ConfigService], // Inject ConfigService to access environment variables
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres', // Sets the SQL dialect to PostgreSQL
        host: configService.get<string>('DB_HOST'), // The database host
        port: configService.get<number>('DB_PORT'), // The database port
        username: configService.get<string>('DB_USER'), // The database user
        password: configService.get<string>('DB_PASSWORD'), // The database password
        database: configService.get<string>('DB_NAME'), // The database name
        autoLoadModels: true, // Automatically discovers and loads models registered within the app
        // synchronize creates the tables in the database based on the models.
        // WARNING: This should be disabled in production.
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: false, // Disables logging of SQL queries to the console
      }),
    }),
  ],
  // Export SequelizeModule to make database connection and models available elsewhere
  exports: [SequelizeModule],
})
export class SequelizeDatabaseModule {}
