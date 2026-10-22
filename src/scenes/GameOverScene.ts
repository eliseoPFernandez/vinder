import Phaser from 'phaser';
import { STRINGS } from '../data/strings';
import { Button } from '../objects/Button';
import { Character, type Mood } from '../objects/Character';
import { getBestScore, submitScore } from '../systems/storage';
import { COLORS, FONT_FAMILY } from '../theme';

export interface GameOverData {
  score: number;
  message: string;
  mood: Mood;
}

// Buttons ignore input briefly so the swipe that ended the match can't tap them.
const INPUT_DELAY_MS = 600;

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data: GameOverData): void {
    const { width } = this.scale;
    const cx = width / 2;
    const isNewRecord = submitScore(data.score);
    const best = getBestScore();

    const textStyle = (size: number, color: string = COLORS.cream) => ({
      fontFamily: FONT_FAMILY,
      fontSize: `${size}px`,
      fontStyle: 'bold',
      color,
      align: 'center',
      wordWrap: { width: width - 60 },
      padding: { top: 6, bottom: 6 },
    });

    new Character(this, cx, 140).setMood(data.mood);

    this.add.text(cx, 260, STRINGS.gameOver, textStyle(44, COLORS.reject)).setOrigin(0.5);
    this.add.text(cx, 330, data.message, textStyle(24)).setOrigin(0.5);
    this.add.text(cx, 425, STRINGS.finalScore(data.score), textStyle(48)).setOrigin(0.5);

    const recordText = this.add
      .text(
        cx,
        490,
        isNewRecord ? STRINGS.newRecord : STRINGS.bestScore(best),
        textStyle(isNewRecord ? 28 : 22, COLORS.gold),
      )
      .setOrigin(0.5);
    if (isNewRecord) {
      this.tweens.add({
        targets: recordText,
        scale: 1.12,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    const playAgain = () => this.scene.start('GameScene');
    const toMenu = () => this.scene.start('MenuScene');
    const buttons = [
      new Button(this, cx, 610, STRINGS.playAgain, playAgain),
      new Button(this, cx, 705, STRINGS.backToMenu, toMenu, 'secondary'),
    ];

    buttons.forEach((b) => b.disableInteractive().setAlpha(0.5));
    this.time.delayedCall(INPUT_DELAY_MS, () => {
      buttons.forEach((b) => b.setInteractive({ useHandCursor: true }).setAlpha(1));
      this.input.keyboard?.once('keydown-SPACE', playAgain);
      this.input.keyboard?.once('keydown-ENTER', playAgain);
    });
  }
}
