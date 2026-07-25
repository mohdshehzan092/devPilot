import {
  Controller,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { RunnerService } from '../services/runner.service';

@Controller('runner')
@UseGuards(JwtAuthGuard)
export class RunnerController {
  constructor(
    private readonly runnerService: RunnerService,
  ) {}

  @Post('collection/:collectionId')
  runCollection(
    @Param('collectionId') collectionId: string,
    @CurrentUser() user: any,
  ) {
    return this.runnerService.runCollection(
      collectionId,
      new Types.ObjectId(user._id),
    );
  }
}