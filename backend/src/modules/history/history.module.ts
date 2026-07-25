import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  History,
  HistorySchema,
} from './schemas/history.schema';

import { HistoryRepository } from './repositories/history.repository';
import { HistoryController } from './controllers/history.controllers';
import { HistoryService } from './services/history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: History.name,
        schema: HistorySchema,
      },
    ]),
  ],
  controllers: [HistoryController],
  providers: [
    HistoryService,
    HistoryRepository,
  ],
  exports: [
    HistoryRepository,
    HistoryService,
  ],
})
export class HistoryModule {}