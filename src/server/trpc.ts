import { initTRPC } from '@trpc/server';
import { telemetry } from '@devvit/analytics/server/reddit';
import { transformer } from '../shared/transformer';
import { Context } from './context';
import { context, reddit } from '@devvit/web/server';
import { countDecrement, countGet, countIncrement } from './core/count';
import { z } from 'zod';

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

const counterInput = z
  .object({
    amount: z.number().optional(),
    journeyId: z.string().min(1).optional(),
  })
  .optional();

const recordCounterProgress = async (
  journeyId: string | undefined,
  action: 'increment' | 'decrement'
) => {
  if (!journeyId) return;

  try {
    await telemetry.journeyProgress({
      journeyId,
      progress: 0.5,
      action,
      actionDetails: 'counter',
    });
  } catch (error) {
    console.warn(`Failed to record ${action} journey progress.`, error);
  }
};

export const appRouter = t.router({
  journeys: t.router({
    appReady: publicProcedure.mutation(async () => {
      return await telemetry.appReady();
    }),
    start: publicProcedure.mutation(async () => {
      return await telemetry.startJourney();
    }),
  }),
  init: t.router({
    get: publicProcedure.query(async () => {
      const [count, username] = await Promise.all([
        countGet(),
        reddit.getCurrentUsername(),
      ]);

      return {
        count,
        postId: context.postId,
        username,
      };
    }),
  }),
  counter: t.router({
    increment: publicProcedure
      .input(counterInput)
      .mutation(async ({ input }) => {
        const { postId } = context;
        const count = await countIncrement(input?.amount);
        await recordCounterProgress(input?.journeyId, 'increment');

        return {
          count,
          postId,
          type: 'increment',
        };
      }),
    decrement: publicProcedure
      .input(counterInput)
      .mutation(async ({ input }) => {
        const { postId } = context;
        const count = await countDecrement(input?.amount);
        await recordCounterProgress(input?.journeyId, 'decrement');

        return {
          count,
          postId,
          type: 'decrement',
        };
      }),
    get: publicProcedure.query(async () => {
      return await countGet();
    }),
  }),
});

export type AppRouter = typeof appRouter;
