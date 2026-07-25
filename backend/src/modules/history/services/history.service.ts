import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { HistoryRepository } from '../repositories/history.repository';

@Injectable()
export class HistoryService {
  constructor(private readonly historyRepository: HistoryRepository) {}

  async saveExecution(data: {
    requestId: Types.ObjectId;
    workspaceId: Types.ObjectId;
    collectionId: Types.ObjectId;
    ownerId: Types.ObjectId;
    method: string;
    url: string;
    requestHeaders: Record<string, any>;
    requestBody: any;
    responseStatus: number;
    statusText: string;
    responseHeaders: Record<string, any>;
    responseBody: any;
    responseTime: number;
    responseSize: number;
    isError: boolean;
    errorMessage?: string;
  }) {
    return this.historyRepository.create({
      ...data,
      executedAt: new Date(),
    });
  }
  async getAllHistory(ownerId: Types.ObjectId) {
    return this.historyRepository.findAllByOwner(ownerId);
  }
  async getHistoryById(historyId: string, ownerId: Types.ObjectId) {
    const history = await this.historyRepository.findByIdAndOwner(
      historyId,
      ownerId,
    );

    if (!history) {
      throw new NotFoundException('History not found');
    }

    return history;
  }
  async deleteHistory(historyId: string, ownerId: Types.ObjectId) {
    const history = await this.historyRepository.softDeleteByOwner(
      historyId,
      ownerId,
    );

    if (!history) {
      throw new NotFoundException('History not found');
    }

    return {
      message: 'History deleted successfully',
    };
  }
}
