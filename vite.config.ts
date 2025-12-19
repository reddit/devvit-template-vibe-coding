import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { devvit } from '@devvit/start/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwind(),
    // @ts-expect-error - due to using npm link for demo
    devvit({}),
  ],
});
