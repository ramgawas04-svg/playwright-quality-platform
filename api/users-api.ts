import { type ApiClient, type ApiResult } from './core/api-client';
import { type User } from './models/user';

export class UsersApi {
  constructor(private readonly apiClient: ApiClient) {}

  async getUser(userId: number): Promise<ApiResult<User>> {
    return this.apiClient.get(
      `/users/${userId}`,
      isUser,
      `Received an invalid user response for user ${userId}.`,
    );
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
