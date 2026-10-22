// Saved progress, kept in the browser's localStorage. Every access is guarded:
// private browsing or blocked storage must never break the game.
const BEST_SCORE_KEY = 'vinder.bestScore';

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: the record just won't persist.
  }
}

export function getBestScore(): number {
  const value = Number(read(BEST_SCORE_KEY));
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

/** Saves the score if it beats the record. Returns true when it's a new record. */
export function submitScore(score: number): boolean {
  if (score <= getBestScore()) return false;
  write(BEST_SCORE_KEY, String(score));
  return true;
}
