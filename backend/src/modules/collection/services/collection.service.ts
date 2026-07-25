import { Injectable, NotFoundException } from "@nestjs/common";
import { CollectionRepository } from "../repositories/collection.repository";
import { WorkspaceRepository } from "src/modules/workspace/repositories/workspace.repository";
import { CreateCollectionDto } from "../dto/create-collection.dto";
import { Types } from "mongoose";

@Injectable()
export class CollectionService {
    constructor (
        private readonly collectionRepository: CollectionRepository,

        private readonly workspaceRepository : WorkspaceRepository

    ) {}
    async createCollection (
        dto: CreateCollectionDto,
        ownerId: Types.ObjectId,
    ){
        const workspaceExists = await this.workspaceRepository.existsByIdAndOwner(
            dto.workspaceId,
            ownerId
        )
        if(!workspaceExists){
            throw new NotFoundException('workspace not found')
        }
        const lastCollection = await this.collectionRepository.findLastSortOrder(
            new Types.ObjectId(dto.workspaceId)
        )
        const sortOrder = lastCollection ? lastCollection.sortOrder + 1: 0;

        return this.collectionRepository.create({
            ...dto,
            ownerId,
            workspaceId: new Types.ObjectId(dto.workspaceId),
            sortOrder
        })
    }
    async getCollectionById(
        collectionId: string,
        ownerId: Types.ObjectId
    ) {
        const collection = await this.collectionRepository.findByIdAndOwner(
            collectionId,
            ownerId
        )
        if(!collection){
            throw new NotFoundException('Collection not found')
        }
        return collection
    }
    async getCollectionsByWorkspace(
  workspaceId: string,
  ownerId: Types.ObjectId,
) {
  const workspaceExists =
    await this.workspaceRepository.existsByIdAndOwner(
      workspaceId,
      ownerId,
    );

  if (!workspaceExists) {
    throw new NotFoundException(
      'Workspace not found',
    );
  }

  const collections =
    await this.collectionRepository.findAllByWorkspace(
      new Types.ObjectId(workspaceId),
      ownerId,
    );

  return {
    items: collections,
    total: collections.length,
  };
}

    async updateCollection(
        collectionId : string,
        ownerId: Types.ObjectId,
        dto
    ) {
        const collection = await this.collectionRepository.updateByOwner(
            collectionId,
            ownerId,
            dto
        )
        if(!collection){
            throw new NotFoundException('collection not found')
        }
        return collection;
    }
    async deleteCollection(
  collectionId: string,
  ownerId: Types.ObjectId,
) {
  const collection =
    await this.collectionRepository.softDeleteByOwner(
      collectionId,
      ownerId,
    );

  if (!collection) {
    throw new NotFoundException(
      'Collection not found',
    );
  }

  return {
    message: 'Collection deleted successfully',
  };
}
}