import { context, reddit, runWithContext } from '@devvit/web/server';
import { expect } from 'vitest';
import { test } from '../test';
import { createPost } from './post';

test('creates posts for the current app after reinitialization', async () => {
  const requestContext = { ...context };

  for (const appSlug of ['original-app', 'renamed-app']) {
    const post = await runWithContext({ ...requestContext, appSlug }, createPost);
    const storedPost = await reddit.getPostById(post.id);

    expect(storedPost.title).toBe(appSlug);
  }
});
