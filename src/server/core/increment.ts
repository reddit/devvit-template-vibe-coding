import { redis } from '@devvit/web/server';

const key = 'count';

export const incrementGet = async () => {
  return Number((await redis.get(key)) ?? 0);
};

export const incrementIncrement = async () => {
  return await redis.incrBy(key, 1);
};

export const incrementDecrement = async () => {
  return await redis.incrBy(key, -1);
};
