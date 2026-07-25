import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Model, Types } from 'mongoose';

import {
  Workspace,
  WorkspaceDocument,
} from '../schemas/workspace.schema';

@Injectable()
export class WorkspaceRepository {
  constructor(
    @InjectModel(Workspace.name)
    private readonly workspaceModel: Model<WorkspaceDocument>,
  ) {}

  async create(data: Partial<Workspace>) {
    return this.workspaceModel.create(data);
  }

  async findBySlug(slug: string) {
    return this.workspaceModel.findOne({
        slug,
        isDeleted: false,
    })
  }
  
  async findByIdAndOwner(
    workspaceId: string,
    ownerId: Types.ObjectId, 
  ){
    return this.workspaceModel.findOne({
        _id: workspaceId,
        ownerId,
        isDeleted: false,
    })
  }
  async updateByOwner(
    workspaceId: string,
    ownerId: Types.ObjectId,
    data: Partial<Workspace>,
  ){
    return this.workspaceModel.findOneAndUpdate({
        _id: workspaceId,
        ownerId,
        isDeleted: false,
    }, {new: true,  ...data})
  }
  async softDeleteByOwner(
  workspaceId: string,
  ownerId: Types.ObjectId,
) {
  return this.workspaceModel.findOneAndUpdate(
    {
      _id: workspaceId,
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
async findAllByOwner(ownerId: Types.ObjectId) {
  return this.workspaceModel
    .find({
      ownerId,
      isDeleted: false,
    })
    .sort({
      updatedAt: -1,
    })
    .lean();
}
  async existsByIdAndOwner(
  workspaceId: string,
  ownerId: Types.ObjectId,
) {
  return this.workspaceModel.exists({
    _id: workspaceId,
    ownerId,
    isDeleted: false,
  });
}
}