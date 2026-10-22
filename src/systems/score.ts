import type { Wine } from './deck';

export const MAX_PATIENCE = 3;

/**
 * What happened after a swipe:
 * - scored: drank a good wine (+1)
 * - died: drank a bad wine (game over)
 * - dodged: refused a bad wine (safe, no points)
 * - lostPatience: refused a good wine (-1 patience)
 * - gaveUp: refused a good wine with no patience left (game over)
 */
export type Outcome = 'scored' | 'died' | 'dodged' | 'lostPatience' | 'gaveUp';

/** Score and patience for a single match. */
export class Match {
  score = 0;
  patience = MAX_PATIENCE;
  over = false;

  resolve(wine: Wine, drank: boolean): Outcome {
    if (drank) {
      if (wine.isGood) {
        this.score++;
        return 'scored';
      }
      this.over = true;
      return 'died';
    }

    if (!wine.isGood) return 'dodged';

    this.patience--;
    if (this.patience <= 0) {
      this.over = true;
      return 'gaveUp';
    }
    return 'lostPatience';
  }
}
