import './index.css';

import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { navigateTo } from '@devvit/web/client';
import { trpc } from './trpc';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './server/trpc';

type RouterOutputs = inferRouterOutputs<AppRouter>;

export const App = () => {
  const [init, setInit] = useState<RouterOutputs['init']['get'] | null>(null);

  const fetchInit = async () => {
    const data = await trpc.init.get.query();
    setInit(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchInit();
  }, []);

  const [loading, setLoading] = useState(false);
  const { username, count } = init ?? { count: 0 };

  const increment = async () => {
    setLoading(true);
    const result = await trpc.counter.increment.mutate();
    setInit((prev) => (prev ? { ...prev, count: result.count } : null));
    setLoading(false);
  };

  const decrement = async () => {
    setLoading(true);
    const result = await trpc.counter.decrement.mutate();
    setInit((prev) => (prev ? { ...prev, count: result.count } : null));
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4">
      <img
        className="mx-auto w-1/2 max-w-[250px] object-contain"
        src="/snoo.png"
        alt="Snoo"
      />
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-2xl font-bold text-gray-900">
          {username ? `Hey ${username} 👋` : ''}
        </h1>
        <p className="text-center text-base text-gray-600">
          Edit{' '}
          <span className="rounded bg-[#e5ebee] px-1 py-0.5">
            src/client/game/App.tsx
          </span>{' '}
          to get started.
        </p>
      </div>
      <div className="mt-5 flex items-center justify-center">
        <button
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#d93900] font-mono text-[2.5em] leading-none text-white transition-colors"
          onClick={decrement}
          disabled={loading}
        >
          -
        </button>
        <span className="mx-5 min-w-[50px] text-center text-[1.8em] leading-none font-medium text-gray-900">
          {loading ? '...' : count}
        </span>
        <button
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#d93900] font-mono text-[2.5em] leading-none text-white transition-colors"
          onClick={increment}
          disabled={loading}
        >
          +
        </button>
      </div>
      <footer className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3 text-[0.8em] text-gray-600">
        <button
          className="cursor-pointer"
          onClick={() => navigateTo('https://developers.reddit.com/docs')}
        >
          Docs
        </button>
        <span className="text-gray-300">|</span>
        <button
          className="cursor-pointer"
          onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
        >
          r/Devvit
        </button>
        <span className="text-gray-300">|</span>
        <button
          className="cursor-pointer"
          onClick={() => navigateTo('https://discord.com/invite/R7yu2wh9Qz')}
        >
          Discord
        </button>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
