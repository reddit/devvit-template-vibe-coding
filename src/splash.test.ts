import { afterEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

let requestExpandedModeMock: ReturnType<typeof vi.fn>;

vi.mock('@devvit/web/client', () => {
  requestExpandedModeMock = vi.fn();

  return {
    // used in the footer
    navigateTo: vi.fn(),
    // used in the greeting
    context: {
      username: 'test-user',
    },
    // used by the "Tap to Start" button
    requestExpandedMode: requestExpandedModeMock,
  };
});

afterEach(() => {
  requestExpandedModeMock?.mockReset();
});

describe('Splash', () => {
  it('renders Snoo + Tap to Start, and clicking calls requestExpandedMode(nativeEvent, "game")', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    // `src/splash.tsx` renders immediately on import (createRoot(...).render(...))
    await import('./splash');

    const img = page.getByAltText('Snoo');
    await expect.element(img).toBeInTheDocument();
    const src = img.element().getAttribute('src') ?? '';
    expect(src).toMatch(/\/snoo\.png$/);

    const button = page.getByRole('button', { name: /tap to start/i });
    await expect.element(button).toBeInTheDocument();

    await button.click();

    expect(requestExpandedModeMock).toHaveBeenCalledTimes(1);
    const [nativeEvent, mode] = requestExpandedModeMock.mock.calls[0] ?? [];
    expect(nativeEvent).toBeInstanceOf(Event);
    expect(mode).toBe('game');
  });
});
