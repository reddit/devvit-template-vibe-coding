import { initTRPC } from '@trpc/server';
import { transformer } from '../shared/transformer';
import { Context } from './context';
import { context, reddit, redis } from '@devvit/web/server';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = t.router({
  init: t.router({
    get: publicProcedure.query(async () => {
      const [count, username] = await Promise.all([
        redis.get('count'),
        reddit.getCurrentUsername(),
      ]);

      return {
        count: count ? parseInt(count) : 0,
        postId: context.postId,
        username,
      };
    }),
  }),
  counter: t.router({
    increment: publicProcedure.mutation(async () => {
      console.log('incrementing count');
      const { postId } = context;
      return {
        count: await redis.incrBy('count', 1),
        postId,
        type: 'increment',
      };
    }),
    decrement: publicProcedure.mutation(async () => {
      console.log('decrementing count');
      const { postId } = context;
      return {
        count: await redis.incrBy('count', -1),
        postId,
        type: 'decrement',
      };
    }),
    get: publicProcedure.query(() => {
      return 0;
    }),
  }),
});

export type AppRouter = typeof appRouter;
