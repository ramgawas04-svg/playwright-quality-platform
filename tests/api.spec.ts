import { test, expect } from '../fixtures/page-fixtures';
import { validPostCreationPayload } from '../test-data/posts';

test('gets a post by ID', async ({ postsApi }) => {
  const result = await postsApi.getPost(1);

  expect(result.ok).toBe(true);
  expect(result.status).toBe(200);
  expect(result.body).toEqual(
    expect.objectContaining({
      userId: 1,
      id: 1,
      title: expect.any(String),
      body: expect.any(String),
    }),
  );
});

test('creates a post', async ({ postsApi }) => {
  const result = await postsApi.createPost(validPostCreationPayload);

  expect(result.ok).toBe(true);
  expect(result.status).toBe(201);
  expect(result.body.id).toEqual(expect.any(Number));
  expect(result.body.userId).toBe(validPostCreationPayload.userId);
  expect(result.body.title).toBe(validPostCreationPayload.title);
  expect(result.body.body).toBe(validPostCreationPayload.body);
});

test('gets a user by ID', async ({ usersApi }) => {
  const result = await usersApi.getUser(1);

  expect(result.ok).toBe(true);
  expect(result.status).toBe(200);
  expect(result.body).toEqual(
    expect.objectContaining({
      id: 1,
      name: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
    }),
  );
});
