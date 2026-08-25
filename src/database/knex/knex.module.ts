import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: KNEX_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const instance = knex({
          client: 'pg',
          connection: {
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            user: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
          },
          pool: {
            min: 2,
            max: 10,
          },
        });
        return instance;
      },
    },
  ],
  exports: [KNEX_CONNECTION],
})
export class KnexDatabaseModule {}
