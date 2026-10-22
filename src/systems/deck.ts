import Phaser from 'phaser';
import winesData from '../data/wines.json';

export interface Wine {
  id: string;
  name: string;
  grape: string;
  country: string;
  vintage: number;
  price: number;
  description: string;
  isGood: boolean;
  deathMessage?: string;
  difficulty: number;
}

export const WINES: readonly Wine[] = winesData;

/**
 * Hands out wines in random order. A new Deck (one per match) gets a fresh
 * shuffle; when it runs out it reshuffles, never repeating the last card
 * back-to-back.
 */
export class Deck {
  private pile: Wine[] = [];
  private last: Wine | null = null;

  constructor(private readonly wines: readonly Wine[] = WINES) {
    this.refill();
  }

  draw(): Wine {
    if (this.pile.length === 0) this.refill();
    const wine = this.pile.pop()!;
    this.last = wine;
    return wine;
  }

  private refill(): void {
    this.pile = Phaser.Utils.Array.Shuffle([...this.wines]);
    // pop() takes from the end, so keep the previous card away from it.
    const top = this.pile.length - 1;
    if (this.pile.length > 1 && this.pile[top] === this.last) {
      [this.pile[0], this.pile[top]] = [this.pile[top], this.pile[0]];
    }
  }
}
