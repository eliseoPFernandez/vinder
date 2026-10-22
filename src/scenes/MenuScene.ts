import Phaser from 'phaser';
import { STRINGS } from '../data/strings';
import { Button } from '../objects/Button';
import { Character } from '../objects/Character';
import { getBestScore } from '../systems/storage';
import { COLORS, FONT_FAMILY } from '../theme';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    const { width } = this.scale;
    const cx = width / 2;

    new Character(this, cx, 170);

    this.add
      .text(cx, 290, STRINGS.title, {
        fontFamily: FONT_FAMILY,
        fontSize: '60px',
        fontStyle: 'bold',
        color: COLORS.cream,
        padding: { top: 8, bottom: 8 },
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 350, STRINGS.tagline, {
        fontFamily: FONT_FAMILY,
        fontSize: '22px',
        fontStyle: 'italic',
        color: COLORS.cream,
      })
      .setOrigin(0.5)
      .setAlpha(0.8);

    this.add
      .text(cx, 450, STRINGS.bestScore(getBestScore()), {
        fontFamily: FONT_FAMILY,
        fontSize: '24px',
        fontStyle: 'bold',
        color: COLORS.gold,
      })
      .setOrigin(0.5);

    const play = () => this.scene.start('GameScene');
    new Button(this, cx, 560, STRINGS.play, play);
    new Button(this, cx, 650, STRINGS.cellar, () => this.scene.start('CellarScene'), 'secondary');

    this.add
      .text(cx, 750, STRINGS.howToPlay, {
        fontFamily: FONT_FAMILY,
        fontSize: '18px',
        color: COLORS.cream,
        align: 'center',
        lineSpacing: 6,
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

    this.input.keyboard?.once('keydown-SPACE', play);
    this.input.keyboard?.once('keydown-ENTER', play);
  }
}
