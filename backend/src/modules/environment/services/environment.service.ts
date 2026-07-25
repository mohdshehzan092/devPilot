import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { EnvironmentRepository } from '../repositories/environment.repository';
import { WorkspaceRepository } from 'src/modules/workspace/repositories/workspace.repository';

import { CreateEnvironmentDto } from '../dto/create-environment.dto';
import { UpdateEnvironmentDto } from '../dto/update-environment.dto';

@Injectable()
export class EnvironmentService {
  constructor(
    private readonly environmentRepository: EnvironmentRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    
  ) {}

  async createEnvironment(
    dto: CreateEnvironmentDto,
    ownerId: Types.ObjectId,
  ) {
    const workspace =
  await this.workspaceRepository.findByIdAndOwner(
    dto.workspaceId,
    ownerId,
  );

if (!workspace) {
  throw new NotFoundException(
    'Workspace not found',
  );
}
    const environment =
      await this.environmentRepository.create({
        ...dto,
        workspaceId: new Types.ObjectId(
          dto.workspaceId,
        ),
        ownerId,
      });

    return environment;
  }

  async getAllEnvironments(
    workspaceId: string,
    ownerId: Types.ObjectId,
  ) {
    return this.environmentRepository.findAllByWorkspace(
      new Types.ObjectId(workspaceId),
      ownerId,
    );
  }

  async getEnvironmentById(
    environmentId: string,
    ownerId: Types.ObjectId,
  ) {
    const environment =
      await this.environmentRepository.findByIdAndOwner(
        environmentId,
        ownerId,
      );

    if (!environment) {
      throw new NotFoundException(
        'Environment not found',
      );
    }

    return environment;
  }

  async updateEnvironment(
    environmentId: string,
    dto: UpdateEnvironmentDto,
    ownerId: Types.ObjectId,
  ) {
    const updateData: any = {
      ...dto,
    };

    if (dto.workspaceId) {
      updateData.workspaceId =
        new Types.ObjectId(dto.workspaceId);
    }

    const environment =
      await this.environmentRepository.updateByOwner(
        environmentId,
        ownerId,
        updateData,
      );

    if (!environment) {
      throw new NotFoundException(
        'Environment not found',
      );
    }

    return environment;
  }

  async deleteEnvironment(
    environmentId: string,
    ownerId: Types.ObjectId,
  ) {
    const environment =
      await this.environmentRepository.softDeleteByOwner(
        environmentId,
        ownerId,
      );

    if (!environment) {
      throw new NotFoundException(
        'Environment not found',
      );
    }

    return {
      message:
        'Environment deleted successfully',
    };
  }
}