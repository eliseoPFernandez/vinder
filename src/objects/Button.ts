import Phaser from 'phaser';
import { COLORS, FONT_FAMILY } from '../theme';

export type ButtonVariant = 'primary' | 'secondary';

const STYLES: Record<ButtonVariant, { fill: number; text: string; width: number; height: number; fontSize: number }> = {
  primary: { fill: COLORS.buttonPrimary, text: COLORS.buttonPrimaryText, width: 260, height: 72, fontSize: 30 },
  secondary: { fill: COLORS.buttonSecondary, text: COLORS.cream, width: 200, height: 56, fontSize: 22 },
};

/** A rounded, tappable button. Fires onClick when released on top of it. */
export class Button extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    onClick: () => void,
    variant: ButtonVariant = 'primary',
  ) {
    super(scene, x, y);
    const style = STYLES[variant];
    const radius = style.height / 2;

    const bg = scene.add.graphics();
    bg.fillStyle(0x000000, 0.3);
    bg.fillRoundedRect(-style.width / 2, -style.height / 2 + 5, style.width, style.height, radius);
    bg.fillStyle(style.fill, 1);
    bg.fillRoundedRect(-style.width / 2, -style.height / 2, style.width, style.height, radius);

    const text = scene.add
      .text(0, 0, label, {
        fontFamily: FONT_FAMILY,
        fontSize: `${style.fontSize}px`,
        fontStyle: 'bold',
        color: style.text,
        padding: { top: 4, bottom: 4 },
      })
      .setOrigin(0.5);

    this.add([bg, text]);
    this.setSize(style.width, style.height);
    this.setInteractive({ useHandCursor: true });
    scene.add.existing(this);

    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.setScale(0.94));
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => this.setScale(1));
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
      this.setScale(1);
      onClick();
    });
  }
}
