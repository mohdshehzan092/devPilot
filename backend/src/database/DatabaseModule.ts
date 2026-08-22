import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),

        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('🟢 MongoDB Connected');
          });

          connection.on('disconnected', () => {
            console.log('🟡 MongoDB Connection Closed (Server Reinstated/Stopped)');
          });

          connection.on('error', (error) => {
            console.log('🔴 MongoDB Error', error);
          });

          return connection;
        },
      }),
    }),
  ],

  exports: [MongooseModule],
})
export class DatabaseModule {}