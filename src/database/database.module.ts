import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createConnection } from 'typeorm';
import { DB } from '../common/constant';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(DB.POSTGRES_HOST),
        port: configService.get(DB.POSTGRES_PORT),
        username: configService.get(DB.POSTGRES_USER),
        password: configService.get(DB.POSTGRES_PASSWORD),
        database: configService.get(DB.POSTGRES_DB),
        entities: ['dist/**/*.entity.js'],
        synchronize: true,
        autoLoadEntities: true,
        migrations: ['src/migrations/*.ts', 'dist/migration/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/migration',
        },
      }),
      connectionFactory: async (options) => {
        const connection = await createConnection(options);
        return connection;
      },
    }),
  ],
})
export class DatabaseModule {}
