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

  @Post("create-execution/:requestId")
async execute(
  @Param("requestId") requestId: string,
  @CurrentUser() user: any,
) {
  try {
    const result =
      await this.executionService.executeRequest(
        requestId,
        new Types.ObjectId(user._id),
      );

    

    return result;
  } catch (e) {
    
    console.log(e);

    throw e;
  }
}
}