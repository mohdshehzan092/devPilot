import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  History,
  HistoryDocument,
} from '../schemas/history.schema';

@Injectable()
export class HistoryRepository {
  constructor(
    @InjectModel(History.name)
    private readonly historyModel: Model<HistoryDocument>,
  ) {}

  async create(data: Partial<History>) {
    return this.historyModel.create(data);
  }

async findAllByOwner(ownerId: Types.ObjectId) {
  return this.historyModel
    .find({
      ownerId,
      isDeleted: false,
    })
    .sort({ createdAt: -1 })
    .lean();
}

 async findByIdAndOwner(
  historyId: string,
  ownerId: Types.ObjectId,
) {
  return this.historyModel.findOne({
    _id: historyId,
    ownerId,
    isDeleted: false,
  });
}

  async delete(id: string) {
    return this.historyModel.findByIdAndDelete(id);
  }
  async softDeleteByOwner(
  historyId: string,
  ownerId: Types.ObjectId,
) {
  return this.historyModel.findOneAndUpdate(
    {
      _id: historyId,
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
}