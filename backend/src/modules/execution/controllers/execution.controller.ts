import {
  Controller,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

import { ExecutionService } from '../services/execution.service';

@Controller('execution')
@UseGuards(JwtAuthGuard)
export class ExecutionController {
  constructor(
    private readonly executionService: ExecutionService,
  ) {}

  @Post('create-execution/:requestId')
  execute(
    @Param('requestId') requestId: string,
    @CurrentUser() user: any,
  ) {
    return this.executionService.executeRequest(
      requestId,
      new Types.ObjectId(user._id),
    );
  }
}