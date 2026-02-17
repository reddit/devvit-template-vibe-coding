import './index.css';

import { navigateTo } from '@devvit/web/client';
import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900">
      <img
        className="mx-auto w-1/2 max-w-[250px] object-contain"
        src="/snoo.png"
        alt="Snoo"
      />
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          Hey {context.username ?? 'user'} 👋
        </h1>
        <p className="text-center text-base text-gray-600 dark:text-gray-300">
          Edit{' '}
          <span className="rounded bg-[#e5ebee] px-1 py-0.5 dark:bg-gray-700">
            src/client/splash.tsx
          </span>{' '}
          to get started.
        </p>
      </div>
      <div className="mt-5 flex items-center justify-center">
        <button
          className="flex h-10 w-auto cursor-pointer items-center justify-center rounded-full bg-[#d93900] px-4 text-white transition-colors hover:bg-[#c23300] dark:bg-orange-600 dark:hover:bg-orange-700"
          onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
        >
          Tap to Start
        </button>
      </div>
      <footer className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3 text-[0.8em] text-gray-600 dark:text-gray-400">
        <button
          className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => navigateTo('https://developers.reddit.com/docs')}
        >
          Docs
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          className="cursor-pointer hover:text-gray-900dark:hover:text-white transition-colors"
          onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
        >
          r/Devvit
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          className="cursor-pointer hover:text-gray-900dark:hover:text-white transition-colors"
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
    <Splash />
  </StrictMode>
);
