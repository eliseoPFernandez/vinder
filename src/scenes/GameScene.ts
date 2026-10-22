import Phaser from 'phaser';
import { STRINGS } from '../data/strings';
import { Character } from '../objects/Character';
import { WineCard, type SwipeDirection } from '../objects/WineCard';
import { Deck, type Wine } from '../systems/deck';
import { MAX_PATIENCE, Match, type Outcome } from '../systems/score';
import { COLORS, FONT_FAMILY } from '../theme';
import type { GameOverData } from './GameOverScene';

const HUD_Y = 40;
const CHARACTER_Y = 150;
const FEEDBACK_Y = 255;
const CARD_Y = 530;
// How long the character keeps a happy/impatient face before going back to neutral.
const MOOD_HOLD_MS = 900;
// Pause on the character's final reaction before switching to the game over screen.
const GAME_OVER_DELAY_MS = 900;

export class GameScene extends Phaser.Scene {
  private deck!: Deck;
  private match!: Match;
  private card: WineCard | null = null;
  private character!: Character;
  private scoreText!: Phaser.GameObjects.Text;
  private heartsText!: Phaser.GameObjects.Text;
  private feedback!: Phaser.GameObjects.Text;

  constructor() {
    super('GameScene');
  }

  create(): void {
    const { width } = this.scale;
    this.deck = new Deck();
    this.match = new Match();
    this.card = null;

    this.scoreText = this.add
      .text(24, HUD_Y, '', {
        fontFamily: FONT_FAMILY,
        fontSize: '26px',
        fontStyle: 'bold',
        color: COLORS.cream,
      })
      .setOrigin(0, 0.5);

    this.heartsText = this.add
      .text(width - 24, HUD_Y, '', { fontSize: '26px', padding: { top: 6, bottom: 6 } })
      .setOrigin(1, 0.5);

    this.character = new Character(this, width / 2, CHARACTER_Y);

    this.feedback = this.add
      .text(width / 2, FEEDBACK_Y, '', {
        fontFamily: FONT_FAMILY,
        fontSize: '34px',
        fontStyle: 'bold',
        color: COLORS.cream,
        stroke: '#000000',
        strokeThickness: 6,
        padding: { top: 6, bottom: 6 },
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.updateHud();
    this.spawnCard();

    const keyboard = this.input.keyboard;
    const onLeft = () => this.card?.swipe('left');
    const onRight = () => this.card?.swipe('right');
    keyboard?.on('keydown-LEFT', onLeft);
    keyboard?.on('keydown-RIGHT', onRight);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      keyboard?.off('keydown-LEFT', onLeft);
      keyboard?.off('keydown-RIGHT', onRight);
    });
  }

  private spawnCard(): void {
    const card = new WineCard(this, this.scale.width / 2, CARD_Y, this.deck.draw());
    card.setScale(0.85).setAlpha(0);
    this.tweens.add({ targets: card, scale: 1, alpha: 1, duration: 220, ease: 'Back.easeOut' });

    card.once('swiped', (direction: SwipeDirection) => this.onSwiped(card.wine, direction));
    this.card = card;
  }

  private onSwiped(wine: Wine, direction: SwipeDirection): void {
    this.card = null;
    const outcome = this.match.resolve(wine, direction === 'right');
    this.updateHud();
    this.react(outcome);

    if (this.match.over) {
      const died = outcome === 'died';
      const data: GameOverData = {
        score: this.match.score,
        message: died ? (wine.deathMessage ?? STRINGS.defaultDeath) : STRINGS.gaveUp,
        mood: died ? 'sick' : 'gone',
      };
      this.time.delayedCall(GAME_OVER_DELAY_MS, () => this.scene.start('GameOverScene', data));
    } else {
      this.spawnCard();
    }
  }

  private react(outcome: Outcome): void {
    switch (outcome) {
      case 'scored':
        this.character.setMood('happy', MOOD_HOLD_MS);
        this.showFeedback(STRINGS.scored, COLORS.drink);
        break;
      case 'dodged':
        this.showFeedback(STRINGS.dodged, COLORS.cream);
        break;
      case 'lostPatience':
        this.character.setMood('impatient', MOOD_HOLD_MS);
        this.showFeedback(STRINGS.lostPatience, COLORS.reject);
        break;
      case 'died':
        this.character.setMood('sick');
        break;
      case 'gaveUp':
        this.character.setMood('gone');
        break;
    }
  }

  private updateHud(): void {
    this.scoreText.setText(STRINGS.score(this.match.score));
    const lost = MAX_PATIENCE - this.match.patience;
    this.heartsText.setText(STRINGS.heartFull.repeat(this.match.patience) + STRINGS.heartEmpty.repeat(lost));
  }

  private showFeedback(text: string, color: string): void {
    this.feedback.setText(text).setColor(color).setAlpha(1).setScale(1.4);
    this.tweens.killTweensOf(this.feedback);
    this.tweens.add({ targets: this.feedback, scale: 1, duration: 200, ease: 'Back.easeOut' });
    this.tweens.add({ targets: this.feedback, alpha: 0, delay: 700, duration: 300 });
  }
}
