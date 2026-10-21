import Phaser from 'phaser';
import { STRINGS } from '../data/strings';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, STRINGS.title, {
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontSize: '56px',
        fontStyle: 'bold',
        color: '#f5e6c8',
      })
      .setOrigin(0.5);
  }
}
