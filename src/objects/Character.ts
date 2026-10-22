import Phaser from 'phaser';

export type Mood = 'neutral' | 'happy' | 'impatient' | 'sick' | 'dead' | 'gone' | 'empty';

// Placeholder faces until the polish stage.
const FACES: Record<Mood, string> = {
  neutral: '🙂',
  happy: '😄',
  impatient: '😤',
  sick: '🤢',
  dead: '😵',
  gone: '🚶',
  empty: '🪑',
};

const SICK_GREEN = 0x7dff7d;

// Death animation timing (ms).
const TREMBLE_STEP = 50;
const TREMBLE_REPEATS = 9; // total tremble time = TREMBLE_STEP * 2 * (repeats + 1)
export const DEATH_FALL_AT = TREMBLE_STEP * 2 * (TREMBLE_REPEATS + 1);
const FALL_DURATION = 600;

// Leaving animation timing (ms).
const LEAVE_HUFF = 500;
const WALK_DURATION = 1500;

/** The drinker at the top of the screen. Changes expression in reaction to swipes. */
export class Character extends Phaser.GameObjects.Text {
  private resetTimer: Phaser.Time.TimerEvent | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, FACES.neutral, { fontSize: '96px', padding: { top: 12, bottom: 12 } });
    this.setOrigin(0.5);
    scene.add.existing(this);
  }

  /** Shows a mood; if holdMs is given, goes back to neutral after that time. */
  setMood(mood: Mood, holdMs?: number): this {
    this.stopAll();
    this.setText(FACES[mood]);

    this.setScale(1.25);
    this.scene.tweens.add({ targets: this, scale: 1, duration: 250, ease: 'Back.easeOut' });

    if (holdMs !== undefined) {
      this.resetTimer = this.scene.time.delayedCall(holdMs, () => this.setText(FACES.neutral));
    }
    return this;
  }

  /** Lying down, green: the final pose after drinking a bad wine. */
  setDeadPose(): this {
    this.stopAll();
    return this.setText(FACES.dead).setAngle(90).setTint(SICK_GREEN);
  }

  /** Trembles, turns green, then keels over. */
  playDeath(onComplete: () => void): void {
    this.stopAll();
    this.setText(FACES.sick).setScale(1).setAngle(0);
    const { x, y } = this;

    this.scene.tweens.add({
      targets: this,
      x: x + 7,
      duration: TREMBLE_STEP,
      yoyo: true,
      repeat: TREMBLE_REPEATS,
      ease: 'Sine.easeInOut',
    });

    // Fade the tint from normal to sick green while trembling.
    const white = Phaser.Display.Color.ValueToColor(0xffffff);
    const green = Phaser.Display.Color.ValueToColor(SICK_GREEN);
    this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: DEATH_FALL_AT,
      onUpdate: (tween) => {
        const c = Phaser.Display.Color.Interpolate.ColorWithColor(white, green, 100, tween.getValue() ?? 0);
        this.setTint(Phaser.Display.Color.GetColor(c.r, c.g, c.b));
      },
    });

    this.scene.time.delayedCall(DEATH_FALL_AT, () => {
      this.setX(x).setText(FACES.dead);
      this.scene.tweens.add({
        targets: this,
        angle: 90,
        y: y + 40,
        duration: FALL_DURATION,
        ease: 'Bounce.easeOut',
        onComplete: () => this.scene.time.delayedCall(500, onComplete),
      });
    });
  }

  /** Huffs, then walks off the left edge of the screen. */
  playLeave(onComplete: () => void): void {
    this.stopAll();
    this.setText(FACES.impatient).setScale(1);
    const { y } = this;

    this.scene.tweens.add({ targets: this, scale: 1.3, duration: LEAVE_HUFF / 2, yoyo: true });

    this.scene.time.delayedCall(LEAVE_HUFF, () => {
      this.setText(FACES.gone);
      this.scene.tweens.add({
        targets: this,
        x: -80,
        duration: WALK_DURATION,
        ease: 'Linear',
        onComplete: () => this.scene.time.delayedCall(300, onComplete),
      });
      // Little steps.
      this.scene.tweens.add({ targets: this, y: y - 8, duration: 150, yoyo: true, repeat: -1 });
    });
  }

  private stopAll(): void {
    this.resetTimer?.remove();
    this.resetTimer = null;
    this.scene.tweens.killTweensOf(this);
  }
}
