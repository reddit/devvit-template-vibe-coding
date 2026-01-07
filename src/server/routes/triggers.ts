import { context } from '@devvit/web/server';
import { Hono } from 'hono';
import { createPost } from '../core/post';

export const triggers = new Hono();

triggers.post('/on-app-install', async (c) => {
  try {
    const post = await createPost();

    return c.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    c.status(400);
    return c.json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});
