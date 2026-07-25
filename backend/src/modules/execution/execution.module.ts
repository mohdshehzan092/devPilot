import { Module } from '@nestjs/common';

import { ExecutionController } from './controllers/execution.controller';
import { ExecutionService } from './services/execution.service';
import { HttpClientService } from './services/http-client.service';

import { RequestModule } from '../request/request.module';
import { HistoryModule } from '../history/history.module';
import { EnvironmentModule } from '../environment/environment.module';
import { TestScriptModule } from '../test-script/test-script.module';

@Module({
  imports: [
    RequestModule,
    HistoryModule,
    EnvironmentModule,
    TestScriptModule,
  ],
  controllers: [
    ExecutionController,
  ],
  providers: [
    ExecutionService,
    HttpClientService,
  ],
  exports: [
    ExecutionService,
    HttpClientService,
  ],
})
export class ExecutionModule {}