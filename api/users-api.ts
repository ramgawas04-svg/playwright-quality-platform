import { type APIRequestContext } from '@playwright/test';
import { type User } from './models/user';

export type UserApiResult = {
  status: number;
  ok: boolean;
  body: User;
};

export class UsersApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly apiUrl: string,
  ) {}

  async getUser(userId: number): Promise<UserApiResult> {
    const response = await this.request.get(
      new URL(`/users/${userId}`, this.apiUrl).toString(),
    );
    const body: unknown = await response.json();

    if (!isUser(body)) {
      throw new Error(`Received an invalid user response for user ${userId}.`);
    }

    return {
      status: response.status(),
      ok: response.ok(),
      body,
    };
  }
}

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'id' in value &&
    typeof value.id === 'number' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'username' in value &&
    typeof value.username === 'string' &&
    'email' in value &&
    typeof value.email === 'string'
  );
}
