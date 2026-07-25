import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { RequestService } from 'src/modules/request/services/request.service';
import { ExecutionService } from 'src/modules/execution/services/execution.service';

@Injectable()
export class RunnerService {
  constructor(
    private readonly requestService: RequestService,
    private readonly executionService: ExecutionService,
  ) {}

  async runCollection(
    collectionId: string,
    ownerId: Types.ObjectId,
  ) {
    const requests =
      await this.requestService.getRequestsForRunner(
        collectionId,
        ownerId,
      );

    
    const results: any[] = [];

    for (const request of requests) {
      try {
        const response =
          await this.executionService.executeRequest(
            request._id.toString(),
            ownerId,
          );

        results.push({
          requestId: request._id,
          requestName: request.name,
          success: true,
          response,
        });
      } catch (error: any) {
        results.push({
          requestId: request._id,
          requestName: request.name,
          success: false,
          error:
            error.response?.data ??
            error.message,
        });
      }
    }

    return {
      totalRequests: requests.length,
      executed: results.length,
      successCount: results.filter(
        (r) => r.success,
      ).length,
      failedCount: results.filter(
        (r) => !r.success,
      ).length,
      results,
    };
  }
}
