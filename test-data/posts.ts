import { type CreatePostRequest } from '../api/models/post';

export const validPostCreationPayload: CreatePostRequest = {
  userId: 1,
  title: 'Playwright API testing',
  body: 'Creating a post with Playwright APIRequestContext.',
};
