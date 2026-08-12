import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  appReadyMock,
  countDecrementMock,
  countIncrementMock,
  journeyProgressMock,
  startJourneyMock,
} = vi.hoisted(() => ({
  appReadyMock: vi.fn(),
  countDecrementMock: vi.fn(),
  countIncrementMock: vi.fn(),
  journeyProgressMock: vi.fn(),
  startJourneyMock: vi.fn(),
}));

vi.mock('@devvit/analytics/server/reddit', () => ({
  telemetry: {
    appReady: appReadyMock,
    journeyProgress: journeyProgressMock,
    startJourney: startJourneyMock,
  },
}));

vi.mock('@devvit/web/server', () => ({
  context: { postId: 'post-id' },
  reddit: { getCurrentUsername: vi.fn() },
}));

vi.mock('./core/count', () => ({
  countDecrement: countDecrementMock,
  countGet: vi.fn(),
  countIncrement: countIncrementMock,
}));

import { appRouter } from './trpc';

const caller = appRouter.createCaller({});

beforeEach(() => {
  appReadyMock.mockReset();
  countDecrementMock.mockReset();
  countIncrementMock.mockReset();
  journeyProgressMock.mockReset();
  startJourneyMock.mockReset();
});

describe('journeys', () => {
  it('reports app ready and starts a journey', async () => {
    const appReadyResponse = { receipt: { status: 'ready' } };
    const startResponse = {
      journeyId: 'journey-id',
      receipt: { status: 'started' },
    };
    appReadyMock.mockResolvedValue(appReadyResponse);
    startJourneyMock.mockResolvedValue(startResponse);

    await expect(caller.journeys.appReady()).resolves.toEqual(appReadyResponse);
    await expect(caller.journeys.start()).resolves.toEqual(startResponse);
  });

  it.each([
    {
      action: 'increment' as const,
      count: 1,
      counter: countIncrementMock,
    },
    {
      action: 'decrement' as const,
      count: -1,
      counter: countDecrementMock,
    },
  ])('records progress after $action', async ({ action, count, counter }) => {
    counter.mockResolvedValue(count);
    journeyProgressMock.mockResolvedValue({ receipt: { status: 'recorded' } });

    const result = await caller.counter[action]({ journeyId: 'journey-id' });

    expect(result.count).toBe(count);
    expect(journeyProgressMock).toHaveBeenCalledWith({
      journeyId: 'journey-id',
      progress: 0.5,
      action,
      actionDetails: 'counter',
    });
    expect(counter.mock.invocationCallOrder[0]).toBeLessThan(
      journeyProgressMock.mock.invocationCallOrder[0]!
    );
  });

  it('does not fail a counter update when progress telemetry fails', async () => {
    const warnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
    countIncrementMock.mockResolvedValue(1);
    journeyProgressMock.mockRejectedValue(new Error('telemetry unavailable'));

    await expect(
      caller.counter.increment({ journeyId: 'journey-id' })
    ).resolves.toMatchObject({ count: 1 });
    expect(warnMock).toHaveBeenCalledOnce();
    warnMock.mockRestore();
  });
});
