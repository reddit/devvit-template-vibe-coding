import { createTRPCClient, httpBatchStreamLink } from '@trpc/client';
import type { AppRouter } from './server/trpc';
import { transformer } from './transformer';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchStreamLink({
      url: '/api/trpc',
      transformer,
    }),
  ],
});
