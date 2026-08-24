export type CreatePostRequest = {
  userId: number;
  title: string;
  body: string;
};

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
