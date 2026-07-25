import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { EnvironmentService } from '../services/environment.service';
import { CreateEnvironmentDto } from '../dto/create-environment.dto';
import { UpdateEnvironmentDto } from '../dto/update-environment.dto';

@Controller('environments')
@UseGuards(JwtAuthGuard)
export class EnvironmentController {
  constructor(
    private readonly environmentService: EnvironmentService,
  ) {}

  @Post('create')
  create(
    @Body() dto: CreateEnvironmentDto,
    @CurrentUser() user: any,
  ) {
    
    return this.environmentService.createEnvironment(
      dto,
      new Types.ObjectId(user._id),
    );
  }

  @Get()
  getAll(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser() user: any,
  ) {
    return this.environmentService.getAllEnvironments(
      workspaceId,
      new Types.ObjectId(user._id),
    );
  }

  @Get(':id')
  getById(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.environmentService.getEnvironmentById(
      id,
      new Types.ObjectId(user._id),
    );
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEnvironmentDto,
    @CurrentUser() user: any,
  ) {
    return this.environmentService.updateEnvironment(
      id,
      dto,
      new Types.ObjectId(user._id),
    );
  }

  @Delete('delete/:id')
  delete(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.environmentService.deleteEnvironment(
      id,
      new Types.ObjectId(user._id),
    );
  }
}