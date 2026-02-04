import { afterEach, describe, expect, it, vi } from 'vitest';

let requestExpandedModeMock: ReturnType<typeof vi.fn>;
let navigateToMock: ReturnType<typeof vi.fn>;

vi.mock('@devvit/web/client', () => {
  requestExpandedModeMock = vi.fn();
  navigateToMock = vi.fn();

  return {
    // used in the footer
    navigateTo: navigateToMock,
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
  navigateToMock?.mockReset();
});

describe('Splash', () => {
  it('clicking the "Docs" footer button calls navigateTo(...)', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    // `src/splash.tsx` renders immediately on import (createRoot(...).render(...))
    await import('./splash');

    // Let React commit the initial render.
    await new Promise((r) => setTimeout(r, 0));

    const docsButton = Array.from(document.querySelectorAll('button')).find(
      (b) => /docs/i.test(b.textContent ?? '')
    );
    expect(docsButton).toBeTruthy();

    docsButton!.click();

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith(
      'https://developers.reddit.com/docs'
    );
  });
});
