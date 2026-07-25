import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Collection, CollectionDocument } from '../schemas/collection.schema';

@Injectable()
export class CollectionRepository {
  constructor(
    @InjectModel(Collection.name)
    private readonly collectionModel: Model<CollectionDocument>,
  ) {}

  async create(data: Partial<Collection>) {
    return this.collectionModel.create(data);
  }

  async findByIdAndOwner(collectionId: string, ownerId: Types.ObjectId) {
    return this.collectionModel.findOne({
      _id: collectionId,
      ownerId,
      isDeleted: false,
    });
  }

  async findAllByWorkspace(
    workspaceId: Types.ObjectId,
    ownerId: Types.ObjectId,
  ) {
    return this.collectionModel
      .find({
        workspaceId,
        ownerId,
        isDeleted: false,
      })
      .sort({
        sortOrder: 1,
      })
      .lean();
  }
  async findByIdWorkspaceAndOwner(
    collectionId: string,
    workspaceId: Types.ObjectId,
    ownerId: Types.ObjectId,
  ) {
    return this.collectionModel.findOne({
      _id: collectionId,
      workspaceId,
      ownerId,
      isDeleted: false,
    });
  }
  async updateByOwner(
    collectionId: string,
    ownerId: Types.ObjectId,
    data: Partial<Collection>,
  ) {
    return this.collectionModel.findOneAndUpdate(
      {
        _id: collectionId,
        ownerId,
        isDeleted: false,
      },
      data,
      {
        new: true,
      },
    );
  }

  async softDeleteByOwner(collectionId: string, ownerId: Types.ObjectId) {
    return this.collectionModel.findOneAndUpdate(
      {
        _id: collectionId,
        ownerId,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      {
        new: true,
      },
    );
  }
  async findLastSortOrder(workspaceId: Types.ObjectId) {
    return this.collectionModel
      .findOne({
        workspaceId,
        isDeleted: false,
      })
      .sort({
        sortOrder: -1,
      });
  }
}
