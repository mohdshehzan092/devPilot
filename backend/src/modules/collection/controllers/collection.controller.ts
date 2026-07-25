import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  Delete
} from '@nestjs/common';

import { Types } from 'mongoose';
import { UpdateCollectionDto } from '../dto/update-collection.dto'
import { CollectionService } from '../services/collection.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CreateCollectionDto } from '../dto/create-collection.dto';

@Controller('collections')
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
  ) {}

  @Post('create-collection')
  @UseGuards(JwtAuthGuard)
  createCollection(
    @Body() dto: CreateCollectionDto,
    @CurrentUser() user: any,
  ) {
    return this.collectionService.createCollection(
      dto,
      new Types.ObjectId(user._id),
    );
  }
  @Get('get-collection/:id')
  @UseGuards(JwtAuthGuard)
  getCollectionById(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ){
    return this.collectionService.getCollectionById(
        id,
        new Types.ObjectId(user._id)
    )
  }
@Get('/workspace/:workspaceId')
@UseGuards(JwtAuthGuard)
getCollectionsByWorkspace(
  @Param('workspaceId') workspaceId: string,
  @CurrentUser() user: any,
) {
  return this.collectionService.getCollectionsByWorkspace(
    workspaceId,
    new Types.ObjectId(user._id),
  );
}
@Patch('update-collection/:id')
@UseGuards(JwtAuthGuard)
updateCollection(
  @Param('id') id: string,
  @Body() dto: UpdateCollectionDto,
  @CurrentUser() user: any,
) {
  return this.collectionService.updateCollection(
    id,
    new Types.ObjectId(user._id),
    dto,
  );
}
@Delete('delete-collection/:id')
@UseGuards(JwtAuthGuard)
deleteCollection(
  @Param('id') id: string,
  @CurrentUser() user: any,
) {
  return this.collectionService.deleteCollection(
    id,
    new Types.ObjectId(user._id),
  );
}
}