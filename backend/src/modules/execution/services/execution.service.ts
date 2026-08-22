import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

private buildPathUrl(request: any, variables: Record<string, string>): string {
  let url = request.url;

  url = this.environmentVariableService.replaceVariables(url, variables);

  if (!Array.isArray(request.pathParams)) return url;

  // Parse URL to get port
  let port = '';
  try {
    port = new URL(url).port;
  } catch {}

  for (const param of request.pathParams) {
    if (!param?.enabled || !param?.key) continue;

    if (port && param.key === port) continue;

    if (/^\d+$/.test(param.key)) continue;

    const placeholder = `:${param.key}`;
    if (!url.includes(placeholder)) continue;

    const value = this.environmentVariableService.replaceVariables(
      String(param.value ?? ''),
      variables,
    );

    url = url.replace(placeholder, encodeURIComponent(value));
  }

  return url;
}

  private buildHeaders(
    request: any,
  ): Record<string, string> {
    const headers: Record<string, string> = {};

    if (!Array.isArray(request.headers)) {
      return headers;
    }

    request.headers.forEach((header: any) => {
      if (
        header?.enabled &&
        header?.key &&
        header?.value
      ) {
        headers[header.key] = String(header.value);
      }
    });

    return headers;
  }

  private buildQueryParams(
    request: any,
  ): Record<string, string> {
    const params: Record<string, string> = {};

    if (!Array.isArray(request.queryParams)) {
      return params;
    }

    request.queryParams.forEach((param: any) => {
      if (
        param?.enabled &&
        param?.key &&
        param?.value !== undefined &&
        param?.value !== null
      ) {
        params[param.key] = String(param.value);
      }
    });

    return params;
  }

  private buildBody(request: any) {
    if (
      request.body === undefined ||
      request.body === null ||
      request.body === ''
    ) {
      return undefined;
    }

    if (request.bodyType === 'JSON') {
      try {
        return JSON.parse(request.body);
      } catch {
        throw new BadRequestException(
          'Invalid JSON body',
        );
      }
    }

    return request.body;
  }

  async executeRequest(
    requestId: string,
    ownerId: Types.ObjectId,
  ) {
    const request =
      await this.requestRepository.findForExecution(
        requestId,
        ownerId,
      );

    if (!request) {
      throw new NotFoundException(
        'Request not found',
      );
    }

    
    const variables: Record<string, string> = {};

    if (request.environmentId) {
      const environment =
        await this.environmentRepository.findById(
          request.environmentId.toString(),
        );

      if (environment) {
        environment.variables.forEach(
          (item: any) => {
            if (item?.key) {
              variables[item.key] = String(
                item.value ?? '',
              );
            }
          },
        );
      }
    }

    
    const headers =
      this.buildHeaders(request);

    Object.keys(headers).forEach((key) => {
      headers[key] =
        this.environmentVariableService.replaceVariables(
          headers[key],
          variables,
        );
    });

    /**
     * Query params
     */
    const params =
      this.buildQueryParams(request);

    const finalParams: Record<
      string,
      string
    > = {};

    Object.keys(params).forEach((key) => {
      finalParams[key] =
        this.environmentVariableService.replaceVariables(
          params[key],
          variables,
        );
    });

    /**
     * Body
     */
    let data =
      this.buildBody(request);

    if (data !== undefined) {
      const replacedBody =
        this.environmentVariableService.replaceVariables(
          JSON.stringify(data),
          variables,
        );

      try {
        data = JSON.parse(replacedBody);
      } catch {
        throw new BadRequestException(
          'Invalid JSON after variable replacement',
        );
      }
    }

    /**
     * Authorization
     */
    this.applyAuthorization(
      request,
      headers,
      finalParams,
      variables,
    );

    
    

    const url =
      this.buildPathUrl(
        request,
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

        queryParams: request.queryParams,
        pathParams: request.pathParams,

        bodyType: request.bodyType,
        auth: request.auth,
        testScript: request.testScript,

        responseStatus: response.status,
        statusText: response.statusText,
        responseHeaders: response.headers,
        responseBody: response.data,

        responseTime,
        responseSize:
          JSON.stringify(
            response.data,
          ).length,

        isError: false,
      });

      return {
        status: response.status,
        headers: response.headers,
        responseTime,

        size: JSON.stringify(
          response.data,
        ).length,

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

        queryParams: request.queryParams,
        pathParams: request.pathParams,

        bodyType: request.bodyType,
        auth: request.auth,
        testScript: request.testScript,

        responseStatus:
          error.response?.status ?? 500,

        statusText:
          error.response?.statusText ?? '',

        responseHeaders:
          error.response?.headers ?? {},

        responseBody:
          error.response?.data ?? {},

        responseTime: 0,

        responseSize:
          JSON.stringify(
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
    if (
      !request.auth ||
      !request.auth.type
    ) {
      return;
    }

    switch (request.auth.type) {
      case 'BEARER': {
        const token =
          this.environmentVariableService.replaceVariables(
            request.auth.token ?? '',
            variables,
          );

        headers['Authorization'] =
          `Bearer ${token}`;

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
          Buffer.from(
            `${username}:${password}`,
          ).toString('base64');

        break;
      }

      case 'API_KEY': {
        const value =
          this.environmentVariableService.replaceVariables(
            request.auth.value ?? '',
            variables,
          );

        const key =
          request.auth.key;

        if (!key) {
          break;
        }

        if (
          request.auth.addTo === 'QUERY'
        ) {
          params[key] = value;
        } else {
          headers[key] = value;
        }

        break;
      }
    }
  }
}