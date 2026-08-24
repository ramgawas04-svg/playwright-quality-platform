import {
  type APIRequestContext,
  type APIResponse,
} from '@playwright/test';

export type ApiResult<T> = {
  status: number;
  ok: boolean;
  body: T;
};

export type ResponseValidator<T> = (value: unknown) => value is T;

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly apiUrl: string,
  ) {}

  async get<T>(
    path: string,
    validator: ResponseValidator<T>,
    invalidResponseMessage: string,
  ): Promise<ApiResult<T>> {
    const response = await this.request.get(this.buildUrl(path));

    return this.parseResponse(response, validator, invalidResponseMessage);
  }

  async post<TResponse>(
    path: string,
    requestBody: object,
    validator: ResponseValidator<TResponse>,
    invalidResponseMessage: string,
  ): Promise<ApiResult<TResponse>> {
    const response = await this.request.post(this.buildUrl(path), {
      data: requestBody,
    });

    return this.parseResponse(response, validator, invalidResponseMessage);
  }

  private buildUrl(path: string): string {
    return new URL(path, this.apiUrl).toString();
  }

  private async parseResponse<T>(
    response: APIResponse,
    validator: ResponseValidator<T>,
    invalidResponseMessage: string,
  ): Promise<ApiResult<T>> {
    const body: unknown = await response.json();

    if (!validator(body)) {
      throw new Error(invalidResponseMessage);
    }

    return {
      status: response.status(),
      ok: response.ok(),
      body,
    };
  }
}
