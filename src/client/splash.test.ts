import { describe, expect, it, vi } from 'vitest';

let requestExpandedModeMock: ReturnType<typeof vi.fn>;
let navigateToMock: ReturnType<typeof vi.fn>;
let appReadyMock: ReturnType<typeof vi.fn>;
let startJourneyMock: ReturnType<typeof vi.fn>;

vi.mock('./trpc', () => {
  appReadyMock = vi.fn().mockResolvedValue(undefined);
  startJourneyMock = vi.fn().mockResolvedValue({ journeyId: 'journey-id' });

  return {
    trpc: {
      journeys: {
        appReady: { mutate: appReadyMock },
        start: { mutate: startJourneyMock },
      },
    },
  };
});

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

describe('Splash', () => {
  it('reports app ready and starts a journey when the user taps to start', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    sessionStorage.clear();

    await import('./splash');
    await vi.waitFor(() => expect(appReadyMock).toHaveBeenCalledTimes(1));

    const startButton = Array.from(document.querySelectorAll('button')).find(
      (button) => /tap to start/i.test(button.textContent ?? '')
    );
    expect(startButton).toBeTruthy();

    startButton!.click();
    startButton!.click();

    expect(startJourneyMock).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => {
      expect(sessionStorage.getItem('devvit.telemetry.journeyId')).toBe(
        'journey-id'
      );
    });
    expect(requestExpandedModeMock).toHaveBeenCalledTimes(1);

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
