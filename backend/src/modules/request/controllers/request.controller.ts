import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

import { RequestService } from '../services/request.service';

import { CreateRequestDto } from '../dto/create-request.dto';
import { UpdateRequestDto } from '../dto/update-request.dto';

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
  ) {}

 
  @Post('create-request')
  create(
    @Body() dto: CreateRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.requestService.createRequest(
      dto,
      new Types.ObjectId(user._id),
    );
  }
  @Get('/collection/:collectionId')
getAllByCollection(
  @Param('collectionId') collectionId: string,
  @CurrentUser() user: any,
) {
  return this.requestService.getAllByCollection(
    collectionId,
    new Types.ObjectId(user._id),
  );
}

@Get('get-request/:id')
getById(
  @Param('id') id: string,
  @CurrentUser() user: any,
) {
  return this.requestService.getById(
    id,
    new Types.ObjectId(user._id),
  );
}

@Patch('update-request/:id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateRequestDto,
  @CurrentUser() user: any,
) {
  return this.requestService.updateRequest(
    id,
    dto,
    new Types.ObjectId(user._id),
  );
}

@Delete('delete-request/:id')
delete(
  @Param('id') id: string,
  @CurrentUser() user: any,
) {
  return this.requestService.deleteRequest(
    id,
    new Types.ObjectId(user._id),
  );
}
}