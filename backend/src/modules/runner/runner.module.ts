import { Module } from '@nestjs/common';

import { RunnerController } from './controllers/runner.controller';
import { RunnerService } from './services/runner.service';

import { CollectionModule } from '../collection/collection.module';
import { RequestModule } from '../request/request.module';
import { ExecutionModule } from '../execution/execution.module';

@Module({
  imports: [
    CollectionModule,
    RequestModule,
    ExecutionModule,
  ],
  controllers: [RunnerController],
  providers: [RunnerService],
})
export class RunnerModule {}