import { type ApiClient, type ApiResult } from './core/api-client';
import { type CreatePostRequest, type Post } from './models/post';

export class PostsApi {
  constructor(private readonly apiClient: ApiClient) {}

  async getPost(postId: number): Promise<ApiResult<Post>> {
    return this.apiClient.get(
      `/posts/${postId}`,
      isPost,
      `Received an invalid post response for post ${postId}.`,
    );
  }

  async createPost(
    requestBody: CreatePostRequest,
  ): Promise<ApiResult<Post>> {
    return this.apiClient.post(
      '/posts',
      requestBody,
      isPost,
      'Received an invalid response when creating a post.',
    );
  }
}

function isPost(value: unknown): value is Post {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'userId' in value &&
    typeof value.userId === 'number' &&
    'id' in value &&
    typeof value.id === 'number' &&
    'title' in value &&
    typeof value.title === 'string' &&
    'body' in value &&
    typeof value.body === 'string'
  );
}
