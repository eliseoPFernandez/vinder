import Phaser from 'phaser';

export type Mood = 'neutral' | 'happy' | 'impatient' | 'sick' | 'gone';

// Placeholder faces until the polish stage.
const FACES: Record<Mood, string> = {
  neutral: '🙂',
  happy: '😄',
  impatient: '😤',
  sick: '🤢',
  gone: '🚶',
};

/** The drinker at the top of the screen. Changes expression in reaction to swipes. */
export class Character extends Phaser.GameObjects.Text {
  private resetTimer: Phaser.Time.TimerEvent | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, FACES.neutral, { fontSize: '96px', padding: { top: 12, bottom: 12 } });
    this.setOrigin(0.5);
    scene.add.existing(this);
  }

  /** Shows a mood; if holdMs is given, goes back to neutral after that time. */
  setMood(mood: Mood, holdMs?: number): void {
    this.resetTimer?.remove();
    this.resetTimer = null;
    this.setText(FACES[mood]);

    this.scene.tweens.killTweensOf(this);
    this.setScale(1.25);
    this.scene.tweens.add({ targets: this, scale: 1, duration: 250, ease: 'Back.easeOut' });

    if (holdMs !== undefined) {
      this.resetTimer = this.scene.time.delayedCall(holdMs, () => this.setText(FACES.neutral));
    }
  }
}
