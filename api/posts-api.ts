import { type APIRequestContext } from '@playwright/test';
import { type CreatePostRequest, type Post } from './models/post';

export type PostApiResult = {
  status: number;
  ok: boolean;
  body: Post;
};

export class PostsApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly apiUrl: string,
  ) {}

  async getPost(postId: number): Promise<PostApiResult> {
    const response = await this.request.get(
      new URL(`/posts/${postId}`, this.apiUrl).toString(),
    );
    const body: unknown = await response.json();

    if (!isPost(body)) {
      throw new Error(`Received an invalid post response for post ${postId}.`);
    }

    return {
      status: response.status(),
      ok: response.ok(),
      body,
    };
  }

  async createPost(requestBody: CreatePostRequest): Promise<PostApiResult> {
    const response = await this.request.post(
      new URL('/posts', this.apiUrl).toString(),
      { data: requestBody },
    );
    const body: unknown = await response.json();

    if (!isPost(body)) {
      throw new Error('Received an invalid response when creating a post.');
    }

    return {
      status: response.status(),
      ok: response.ok(),
      body,
    };
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
