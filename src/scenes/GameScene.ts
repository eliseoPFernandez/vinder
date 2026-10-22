import Phaser from 'phaser';
import { STRINGS } from '../data/strings';
import { WineCard, type SwipeDirection } from '../objects/WineCard';
import { COLORS, FONT_FAMILY } from '../theme';

const CARD_Y = 480;

export class GameScene extends Phaser.Scene {
  private card: WineCard | null = null;
  private feedback!: Phaser.GameObjects.Text;

  constructor() {
    super('GameScene');
  }

  create(): void {
    const { width } = this.scale;

    this.add
      .text(width / 2, 70, STRINGS.title, {
        fontFamily: FONT_FAMILY,
        fontSize: '36px',
        fontStyle: 'bold',
        color: COLORS.cream,
        padding: { top: 6, bottom: 6 },
      })
      .setOrigin(0.5);

    this.feedback = this.add
      .text(width / 2, 170, '', {
        fontFamily: FONT_FAMILY,
        fontSize: '44px',
        fontStyle: 'bold',
        color: COLORS.cream,
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.spawnCard();

    const keyboard = this.input.keyboard;
    keyboard?.on('keydown-LEFT', () => this.card?.swipe('left'));
    keyboard?.on('keydown-RIGHT', () => this.card?.swipe('right'));
  }

  private spawnCard(): void {
    const card = new WineCard(this, this.scale.width / 2, CARD_Y, STRINGS.testWine);
    card.setScale(0.85).setAlpha(0);
    this.tweens.add({ targets: card, scale: 1, alpha: 1, duration: 220, ease: 'Back.easeOut' });

    card.once('swiped', (direction: SwipeDirection) => {
      this.showFeedback(direction);
      this.spawnCard();
    });
    this.card = card;
  }

  private showFeedback(direction: SwipeDirection): void {
    const drank = direction === 'right';
    this.feedback
      .setText(drank ? STRINGS.drank : STRINGS.rejected)
      .setColor(drank ? COLORS.drink : COLORS.reject)
      .setAlpha(1)
      .setScale(1.4);

    this.tweens.killTweensOf(this.feedback);
    this.tweens.add({ targets: this.feedback, scale: 1, duration: 200, ease: 'Back.easeOut' });
    this.tweens.add({ targets: this.feedback, alpha: 0, delay: 700, duration: 300 });
  }
}
