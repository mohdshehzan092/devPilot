import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Environment,
  EnvironmentDocument,
} from 'src/modules/environment/schemas/environment.schema';
import { Request, RequestDocument } from '../schemas/request.schema';

@Injectable()
export class RequestRepository {
  constructor(
    @InjectModel(Request.name)
    private readonly requestModel: Model<RequestDocument>,
    @InjectModel(Environment.name)
    private readonly environmentModel: Model<EnvironmentDocument>,
  ) {}

  async create(data: Partial<Request>) {
    try {
      const doc = await this.requestModel.create(data);

      return doc;
    } catch (e) {
      console.log(e);
    }
  }
  async findByIdAndOwner(requestId: string, ownerId: Types.ObjectId) {
    return this.requestModel.findOne({
      _id: requestId,
      ownerId,
      isDeleted: false,
    });
  }

  async findAllByCollection(
    collectionId: Types.ObjectId,
    ownerId: Types.ObjectId,
  ) {
    return this.requestModel
      .find({
        collectionId,
        ownerId,
        isDeleted: false,
      })
      .sort({
        sortOrder: 1,
      })
      .lean();
  }
  async findLastSortOrder(collectionId: Types.ObjectId) {
    return this.requestModel
      .findOne({
        collectionId,
        isDeleted: false,
      })
      .sort({
        sortOrder: -1,
      });
  }

  async updateByOwner(
    requestId: string,
    ownerId: Types.ObjectId,
    data: Partial<Request>,
  ) {
    return this.requestModel.findOneAndUpdate(
      {
        _id: requestId,
        ownerId,
        isDeleted: false,
      },
      data,
      {
        new: true,
      },
    );
  }
  async softDeleteByOwner(requestId: string, ownerId: Types.ObjectId) {
    return this.requestModel.findOneAndUpdate(
      {
        _id: requestId,
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
  async findForExecution(requestId: string, ownerId: Types.ObjectId) {
    return this.requestModel.findOne({
      _id: requestId,
      ownerId,
      isDeleted: false,
    });
  }
  async findById(id: string) {
    return this.environmentModel.findOne({
      _id: id,
      isDeleted: false,
    });
  }
}
