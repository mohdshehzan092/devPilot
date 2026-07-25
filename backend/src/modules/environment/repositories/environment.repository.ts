import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Environment,
  EnvironmentDocument,
} from '../schemas/environment.schema';

@Injectable()
export class EnvironmentRepository {
  constructor(
    @InjectModel(Environment.name)
    private readonly environmentModel: Model<EnvironmentDocument>,
  ) {}

  async create(data: Partial<Environment>) {
    return this.environmentModel.create(data);
  }

  async findByIdAndOwner(
    environmentId: string,
    ownerId: Types.ObjectId,
  ) {
    return this.environmentModel.findOne({
      _id: environmentId,
      ownerId,
      isDeleted: false,
    });
  }

  async findAllByWorkspace(
    workspaceId: Types.ObjectId,
    ownerId: Types.ObjectId,
  ) {
    return this.environmentModel.find({
      workspaceId,
      ownerId,
      isDeleted: false,
    });
  }

  async updateByOwner(
    environmentId: string,
    ownerId: Types.ObjectId,
    data: Partial<Environment>,
  ) {
    return this.environmentModel.findOneAndUpdate(
      {
        _id: environmentId,
        ownerId,
        isDeleted: false,
      },
      data,
      {
        new: true,
      },
    );
  }

  async softDeleteByOwner(
    environmentId: string,
    ownerId: Types.ObjectId,
  ) {
    return this.environmentModel.findOneAndUpdate(
      {
        _id: environmentId,
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
  async findById(id: string) {
  return this.environmentModel.findOne({
    _id: id,
    isDeleted: false,
  });
}
async updateVariables(
  environmentId: string,
  variables: any[],
) {
  return this.environmentModel.findByIdAndUpdate(
    environmentId,
    {
      variables,
    },
    {
      new: true,
    },
  );
}
}