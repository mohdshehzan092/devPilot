import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';

import { validationSchema } from './config/validation';
import { DatabaseModule } from './database/DatabaseModule';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './modules/redis/redis.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { CollectionModule } from './modules/collection/collection.module';
import { RequestModule } from './modules/request/request.module';
import { ExecutionModule } from './modules/execution/execution.module';
import { HistoryModule } from './modules/history/history.module';
import { EnvironmentModule } from './modules/environment/environment.module';
import { RunnerModule } from './modules/runner/runner.module';
import { TestScriptModule } from './modules/test-script/test-script.module';
import { AiModule } from './modules/ai/ai.module';
@Module({
  imports: [
  
ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,

      cache: true,

      expandVariables: true,

      envFilePath: '.env',

      

     

      load: [appConfig, databaseConfig, jwtConfig, redisConfig],
    }),
     DatabaseModule,
     UsersModule,
     AuthModule,
     RedisModule,
     WorkspaceModule,
     CollectionModule,
     RequestModule,
     ExecutionModule,
     HistoryModule,
     EnvironmentModule,
     RunnerModule,
     TestScriptModule,
     AiModule,
  ],
})
export class AppModule {}