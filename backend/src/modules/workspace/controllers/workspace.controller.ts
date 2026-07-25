import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WorkspaceService } from '../services/workspace.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Types } from 'mongoose';
import { Get, Param } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { UpdateWorkspaceDto } from '../dto/update-workspace.dto';
import { Delete } from '@nestjs/common';

@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
  ) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  createWorkspace(
    @Body() dto: CreateWorkspaceDto,
    @CurrentUser() user: any,
  ) {
    return this.workspaceService.createWorkspace(
        dto,
        new Types.ObjectId(user._id),
    )
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getworkspaceById(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ){
    return this.workspaceService.getWorkspaceById(
        id,
        new Types.ObjectId(user._id),
    )
  }
  @Patch(':id')
@UseGuards(JwtAuthGuard)
updateWorkspace(
  @Param('id') id: string,
  @Body() dto: UpdateWorkspaceDto,
  @CurrentUser() user: any,
) {
  return this.workspaceService.updateWorkspace(
    id,
    new Types.ObjectId(user._id),
    dto,
  );
}
@Delete(':id')
@UseGuards(JwtAuthGuard)
deleteWorkspace(
  @Param('id') id: string,
  @CurrentUser() user: any,
) {
  return this.workspaceService.deleteWorkspace(
    id,
    new Types.ObjectId(user._id),
  );
}
@Get()
@UseGuards(JwtAuthGuard)
getMyWorkspaces(
  @CurrentUser() user: any,
) {
  return this.workspaceService.getMyWorkspaces(
    new Types.ObjectId(user._id),
  );
}
}