import Phaser from 'phaser';
import { STRINGS } from '../data/strings';
import { Button } from '../objects/Button';
import { Character } from '../objects/Character';
import { playCheer } from '../systems/sfx';
import { getBestScore, submitScore } from '../systems/storage';
import { COLORS, FONT_FAMILY } from '../theme';

export interface GameOverData {
  score: number;
  message: string;
  cause: 'died' | 'gaveUp';
}

const BANNER_WIDTH = 330;
const BANNER_PADDING = 18;

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

    this.cameras.main.fadeIn(250, 0, 0, 0);

    const character = new Character(this, cx, 140);
    if (data.cause === 'died') character.setDeadPose();
    else character.setMood('empty');

    this.add.text(cx, 250, STRINGS.gameOver, textStyle(40, COLORS.reject)).setOrigin(0.5);
    this.createMessageBanner(cx, 340, data.message);
    this.add.text(cx, 440, STRINGS.finalScore(data.score), textStyle(48)).setOrigin(0.5);

    const recordText = this.add
      .text(
        cx,
        505,
        isNewRecord ? STRINGS.newRecord : STRINGS.bestScore(best),
        textStyle(isNewRecord ? 28 : 22, COLORS.gold),
      )
      .setOrigin(0.5);
    if (isNewRecord) {
      this.time.delayedCall(400, () => playCheer(this));
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
    const toCellar = () => this.scene.start('CellarScene');
    const buttons = [
      new Button(this, cx, 600, STRINGS.playAgain, playAgain),
      new Button(this, cx, 685, STRINGS.cellar, toCellar, 'secondary'),
      new Button(this, cx, 760, STRINGS.backToMenu, toMenu, 'secondary'),
    ];

    buttons.forEach((b) => b.disableInteractive().setAlpha(0.5));
    this.time.delayedCall(INPUT_DELAY_MS, () => {
      buttons.forEach((b) => b.setInteractive({ useHandCursor: true }).setAlpha(1));
      this.input.keyboard?.once('keydown-SPACE', playAgain);
      this.input.keyboard?.once('keydown-ENTER', playAgain);
    });
  }

  /** The death message on a tilted cream "note", popping in. */
  private createMessageBanner(x: number, y: number, message: string): void {
    const text = this.add
      .text(0, 0, `“${message}”`, {
        fontFamily: FONT_FAMILY,
        fontSize: '26px',
        fontStyle: 'bold italic',
        color: COLORS.cardText,
        align: 'center',
        wordWrap: { width: BANNER_WIDTH - BANNER_PADDING * 2 },
        padding: { top: 4, bottom: 4 },
      })
      .setOrigin(0.5);

    const height = text.height + BANNER_PADDING * 2;
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.3);
    bg.fillRoundedRect(-BANNER_WIDTH / 2 + 4, -height / 2 + 6, BANNER_WIDTH, height, 16);
    bg.fillStyle(COLORS.cardFill, 1);
    bg.fillRoundedRect(-BANNER_WIDTH / 2, -height / 2, BANNER_WIDTH, height, 16);

    const banner = this.add.container(x, y, [bg, text]).setAngle(-3).setScale(0);
    this.tweens.add({ targets: banner, scale: 1, delay: 200, duration: 450, ease: 'Back.easeOut' });
  }
}
