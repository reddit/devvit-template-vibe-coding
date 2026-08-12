const JOURNEY_ID_STORAGE_KEY = 'devvit.telemetry.journeyId';

export const getJourneyId = (): string | undefined => {
  try {
    return sessionStorage.getItem(JOURNEY_ID_STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};

export const setJourneyId = (journeyId: string): void => {
  if (!journeyId) return;

  try {
    sessionStorage.setItem(JOURNEY_ID_STORAGE_KEY, journeyId);
  } catch {
    // Journey telemetry remains optional when browser storage is unavailable.
  }
};
