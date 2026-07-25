import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { RequestRepository } from 'src/modules/request/repositories/request.repository';
import { HttpClientService } from './http-client.service';
import { HistoryService } from 'src/modules/history/services/history.service';
import { EnvironmentVariableService } from 'src/modules/environment/services/environment-variable.service';
import { EnvironmentRepository } from 'src/modules/environment/repositories/environment.repository';
import { TestScriptService } from 'src/modules/test-script/services/test-script.service';

@Injectable()
export class ExecutionService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly environmentRepository: EnvironmentRepository,
    private readonly httpClient: HttpClientService,
    private readonly historyService: HistoryService,
    private readonly environmentVariableService: EnvironmentVariableService,
    private readonly testScriptService: TestScriptService,
  ) {}

  private buildHeaders(request: any): Record<string, string> {
    const headers: Record<string, string> = {};

    if (!request.headers) {
      return headers;
    }

    request.headers.forEach((header: any) => {
      if (header.enabled && header.key && header.value) {
        headers[header.key] = header.value;
      }
    });

    return headers;
  }

  private buildQueryParams(request: any): Record<string, string> {
    const params: Record<string, string> = {};

    if (!request.queryParams) {
      return params;
    }

    request.queryParams.forEach((param: any) => {
      if (param.enabled && param.key && param.value) {
        params[param.key] = param.value;
      }
    });

    return params;
  }

  private buildBody(request: any) {
    if (!request.body) {
      return undefined;
    }

    if (request.bodyType === 'JSON') {
      return JSON.parse(request.body);
    }

    return request.body;
  }

  async executeRequest(
    requestId: string,
    ownerId: Types.ObjectId,
  ) {
    const request = await this.requestRepository.findForExecution(
      requestId,
      ownerId,
    );

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    
    let variables: Record<string, string> = {};

    if (request.environmentId) {
      const environment =
        await this.environmentRepository.findById(
          request.environmentId.toString(),
        );

      if (environment) {
        environment.variables.forEach((item: any) => {
          variables[item.key] = item.value;
        });
      }
    }

    
    // Build Request
    const headers = this.buildHeaders(request);
    Object.keys(headers).forEach((key) => {
      headers[key] =
        this.environmentVariableService.replaceVariables(
          headers[key],
          variables,
        );
    });

    const params = this.buildQueryParams(request);

    const finalParams: Record<string, string> = {};

    Object.keys(params).forEach((key) => {
      finalParams[key] =
        this.environmentVariableService.replaceVariables(
          params[key],
          variables,
        );
    });

    let data = this.buildBody(request);

    if (data) {
      data = JSON.parse(
        this.environmentVariableService.replaceVariables(
          JSON.stringify(data),
          variables,
        ),
      );
    }
    this.applyAuthorization(
  request,
  headers,
  finalParams,
  variables,
);


    const url =
      this.environmentVariableService.replaceVariables(
        request.url,
        variables,
      );

    try {
      const startTime = Date.now();
      
      const response =
  await this.httpClient.execute({
    method: request.method,
    url,
    headers,
    params: finalParams,
    data,
  });

const responseTime =
  Date.now() - startTime;

  const testResults =
  await this.testScriptService.execute(
    request.testScript,
    response,
    variables,
  );

      await this.historyService.saveExecution({
        requestId: request._id,
        workspaceId: request.workspaceId,
        collectionId: request.collectionId,
        ownerId: request.ownerId,

        method: request.method,
        url,

        requestHeaders: headers,
        requestBody: data,

        responseStatus: response.status,
        statusText: response.statusText,
        responseHeaders: response.headers,
        responseBody: response.data,

        responseTime,
        responseSize: JSON.stringify(
          response.data,
        ).length,

        isError: false,
      });

      return {
  response: response.data,
  tests: testResults,
};
    } catch (error: any) {
      await this.historyService.saveExecution({
        requestId: request._id,
        workspaceId: request.workspaceId,
        collectionId: request.collectionId,
        ownerId: request.ownerId,

        method: request.method,
        url,

        requestHeaders: headers,
        requestBody: data,

        responseStatus:
          error.response?.status ?? 500,

        statusText:
          error.response?.statusText ?? '',

        responseHeaders:
          error.response?.headers ?? {},

        responseBody:
          error.response?.data ?? {},

        responseTime: 0,

        responseSize: JSON.stringify(
          error.response?.data ?? {},
        ).length,

        isError: true,

        errorMessage: error.message,
      });

      throw error;
    }
  }
  private applyAuthorization(
  request: any,
  headers: Record<string, string>,
  params: Record<string, string>,
  variables: Record<string, string>,
) {
   
  if (!request.auth || !request.auth.type) {
    return;
  }

  switch (request.auth.type) {
    case 'BEARER': {
       
      const token =
        this.environmentVariableService.replaceVariables(
          request.auth.token ?? '',
          variables,
        );

      headers['Authorization'] = `Bearer ${token}`;
      break;
    }

    case 'BASIC': {
         
      const username =
        this.environmentVariableService.replaceVariables(
          request.auth.username ?? '',
          variables,
        );

      const password =
        this.environmentVariableService.replaceVariables(
          request.auth.password ?? '',
          variables,
        );

      headers['Authorization'] =
        'Basic ' +
        Buffer.from(`${username}:${password}`).toString('base64');
      break;
    }

    case 'API_KEY': {
      
      const value =
        this.environmentVariableService.replaceVariables(
          request.auth.value ?? '',
          variables,
        );

      if (request.auth.addTo === 'QUERY') {
        if (!request.auth.key) {
  break;
}

if (request.auth.addTo === 'QUERY') {
  params[request.auth.key] = value;
} else {
  headers[request.auth.key] = value;
}
      } else {
        headers[request.auth.key] = value;
      }

      break;
    }
  }
}

}