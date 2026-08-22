import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { RequestRepository } from '../repositories/request.repository';
import { WorkspaceRepository } from '../../workspace/repositories/workspace.repository';
import { CollectionRepository } from '../../collection/repositories/collection.repository';
import { CreateRequestDto } from '../dto/create-request.dto';
import { UpdateRequestDto } from '../dto/update-request.dto';

@Injectable()
export class RequestService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly collectionRepository: CollectionRepository,
  ) {}

  async createRequest(dto: CreateRequestDto, ownerId: Types.ObjectId) {
    console.log("DTO =>", dto);
    const workspace = await this.workspaceRepository.existsByIdAndOwner(
      dto.workspaceId,
      ownerId,
    );
    if (!workspace) {
      throw new NotFoundException('workspace not found');
    }
    const collection =
      await this.collectionRepository.findByIdWorkspaceAndOwner(
        dto.collectionId,
        new Types.ObjectId(dto.workspaceId),
        ownerId,
      );

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    const lastRequest = await this.requestRepository.findLastSortOrder(
      new Types.ObjectId(dto.collectionId),
    );

    const sortOrder = lastRequest ? lastRequest.sortOrder + 1 : 0;
    return this.requestRepository.create({
      ...dto,

      workspaceId: new Types.ObjectId(dto.workspaceId),

      collectionId: new Types.ObjectId(dto.collectionId),

      ownerId,

      sortOrder,

      environmentId: dto.environmentId
  ? new Types.ObjectId(dto.environmentId)
  : undefined
    });
  }
  async getAllByCollection(collectionId: string, ownerId: Types.ObjectId) {
    const collections = await this.collectionRepository.findByIdAndOwner(
      collectionId,
      ownerId,
    );
    if (!collections) {
      throw new NotFoundException('collections not found');
    }
    const requests = await this.requestRepository.findAllByCollection(
      new Types.ObjectId(collectionId),
      ownerId,
    );
    return {
      items: requests,
      total: requests.length,
    };
  }
  async getById(requestId: string, ownerId: Types.ObjectId) {
    const request = await this.requestRepository.findByIdAndOwner(
      requestId,
      ownerId,
    );
    if (!request) {
      throw new NotFoundException('request not found');
    }
    return request;
  }
  async updateRequest(
  requestId: string,
  dto: UpdateRequestDto,
  ownerId: Types.ObjectId,
) {
  const updateData: any = {
    ...dto,
  };

  if (dto.workspaceId) {
    updateData.workspaceId = new Types.ObjectId(dto.workspaceId);
  }

  if (dto.collectionId) {
    updateData.collectionId = new Types.ObjectId(dto.collectionId);
  }

  
  if (dto.environmentId) {
    updateData.environmentId = new Types.ObjectId(dto.environmentId);
  }

  const request = await this.requestRepository.updateByOwner(
    requestId,
    ownerId,
    updateData,
  );

  if (!request) {
    throw new NotFoundException('Request not found');
  }

  return request;
}
  async deleteRequest(requestId: string, ownerId: Types.ObjectId) {
    const request = await this.requestRepository.softDeleteByOwner(
      requestId,
      ownerId,
    );

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return {
      message: 'Request deleted successfully',
    };
  }
  async getRequestsForRunner(
  collectionId: string,
  ownerId: Types.ObjectId,
) {
  return this.requestRepository.findAllByCollection(
    new Types.ObjectId(collectionId),
    ownerId,
  );
}
}
