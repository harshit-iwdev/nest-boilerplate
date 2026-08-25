import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './config/env.validation';

// Import Database Modules
import { KnexDatabaseModule } from './database/knex/knex.module';
// import { SequelizeDatabaseModule } from './database/sequelize/sequelize.module';
// import { TypeOrmDatabaseModule } from './database/typeorm/typeorm.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      envFilePath: ['.env'],
    }),

    // --- DB CONNECTIONS ---
    // Uncomment the one you want to use for this project:
    
    KnexDatabaseModule, // Default query builder
    // SequelizeDatabaseModule, // Sequelize ORM
    // TypeOrmDatabaseModule, // TypeORM

    // --- YOUR MODULES BELOW ---
    AuthModule,
    UsersModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
