import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Environment,
  EnvironmentSchema,
} from './schemas/environment.schema';

import { EnvironmentController } from './controllers/environment.controller';
import { EnvironmentService } from './services/environment.service';
import { EnvironmentRepository } from './repositories/environment.repository';

import { WorkspaceModule } from '../workspace/workspace.module';
import { EnvironmentVariableService } from './services/environment-variable.service';

@Module({
  imports: [
  
  MongooseModule.forFeature([
      {
        name: Environment.name,
        schema: EnvironmentSchema,
      },
    ]),
    WorkspaceModule,
  ],
  controllers: [EnvironmentController],
  providers: [
    EnvironmentService,
    EnvironmentRepository,
    EnvironmentVariableService,
  ],
  exports: [
    MongooseModule,
    EnvironmentService,
    EnvironmentRepository,
    EnvironmentVariableService,
  ],
})
export class EnvironmentModule {}