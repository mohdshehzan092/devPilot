import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Request, RequestSchema } from './schemas/request.schema';

import { RequestController } from './controllers/request.controller';
import { RequestService } from './services/request.service';
import { RequestRepository } from './repositories/request.repository';

import { WorkspaceModule } from '../workspace/workspace.module';
import { CollectionModule } from '../collection/collection.module';
import { EnvironmentModule } from '../environment/environment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Request.name,
        schema: RequestSchema,
      },
    ]),

    WorkspaceModule,
    CollectionModule,
    EnvironmentModule
  ],

  controllers: [RequestController],

  providers: [
    RequestService,
    RequestRepository,
  ],

  exports: [
    RequestService,
    RequestRepository,
  ],
})
export class RequestModule {}