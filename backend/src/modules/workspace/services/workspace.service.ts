import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';
import { Types } from 'mongoose';

import { WorkspaceRepository } from '../repositories/workspace.repository';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';

@Injectable()
export class WorkspaceService {
    constructor(
        private readonly workspaceRepository: WorkspaceRepository,
    ) {}

    async createWorkspace(
        dto : CreateWorkspaceDto,
        ownerId: Types.ObjectId,
    ) {
        let slug = slugify(dto.name, {
            lower: true,
            strict: true,
            trim: true,
        });
        const existingWorkspace = await this.workspaceRepository.findBySlug(slug) 
        if(existingWorkspace) {
            throw new ConflictException('Workspace with this name already exists');
        }
        return this.workspaceRepository.create({
            ...dto,
            slug,
            ownerId,
        })
    }
    async getWorkspaceById(workspaceId: string, ownerId: Types.ObjectId) {
        const workspace = await this.workspaceRepository.findByIdAndOwner(
            workspaceId,
            ownerId,
        );
        if(!workspace){
            throw new NotFoundException('Workspace not found');
        }
        return workspace;
    }
    async updateWorkspace(
        workspaceId: string,    
    ownerId: Types.ObjectId,
    dto: Partial<CreateWorkspaceDto>,
    ){
        const workspace = await this.workspaceRepository.updateByOwner(
            workspaceId,
            ownerId,
            dto
        )
        if(!workspace){
            throw new NotFoundException('Workspace not found');
        }
        return workspace;
    }
    async deleteWorkspace(
  workspaceId: string,
  ownerId: Types.ObjectId,
) {
  const workspace =
    await this.workspaceRepository.softDeleteByOwner(
      workspaceId,
      ownerId,
    );

  if (!workspace) {
    throw new NotFoundException(
      'Workspace not found',
    );
  }

  return {
    message: 'Workspace deleted successfully',
  };
}
async getMyWorkspaces(ownerId: Types.ObjectId) {
  const workspaces =
    await this.workspaceRepository.findAllByOwner(ownerId);

  return {
    items: workspaces,
    total: workspaces.length,
  };
}
}

