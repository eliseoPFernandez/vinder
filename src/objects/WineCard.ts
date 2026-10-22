import Phaser from 'phaser';
import { STRINGS } from '../data/strings';
import { COLORS, FONT_FAMILY } from '../theme';

export type SwipeDirection = 'left' | 'right';

const CARD_WIDTH = 300;
const CARD_HEIGHT = 420;
const CORNER_RADIUS = 24;

// Horizontal drag distance (px) needed to commit a swipe on release.
const SWIPE_THRESHOLD = 110;
// A quick flick (px/ms) commits even if the card hasn't reached the threshold.
const FLICK_VELOCITY = 0.6;
const FLICK_MIN_DISTANCE = 25;
// How much the card tilts per pixel dragged, and the tilt limit.
const TILT_PER_PIXEL = 0.08;
const MAX_TILT = 20;
// Only this much of the vertical finger movement is applied to the card.
const VERTICAL_FOLLOW = 0.3;
// Window of recent pointer samples used to measure release speed.
const VELOCITY_WINDOW_MS = 100;

/**
 * A swipeable card. Follows the finger and tilts while dragged; on release it
 * either flies off to one side (emitting 'swiped' with the direction) or springs
 * back to the center.
 */
export class WineCard extends Phaser.GameObjects.Container {
  private readonly homeX: number;
  private readonly homeY: number;
  private readonly drinkStamp: Phaser.GameObjects.Text;
  private readonly rejectStamp: Phaser.GameObjects.Text;

  private dragPointerId: number | null = null;
  private dragStartX = 0;
  private dragStartY = 0;
  private samples: { x: number; t: number }[] = [];
  private locked = false;

  constructor(scene: Phaser.Scene, x: number, y: number, label: string) {
    super(scene, x, y);
    this.homeX = x;
    this.homeY = y;

    const left = -CARD_WIDTH / 2;
    const top = -CARD_HEIGHT / 2;

    const body = scene.add.graphics();
    body.fillStyle(0x000000, 0.25);
    body.fillRoundedRect(left + 6, top + 10, CARD_WIDTH, CARD_HEIGHT, CORNER_RADIUS);
    body.fillStyle(COLORS.cardFill, 1);
    body.fillRoundedRect(left, top, CARD_WIDTH, CARD_HEIGHT, CORNER_RADIUS);
    body.lineStyle(4, COLORS.cardBorder, 1);
    body.strokeRoundedRect(left, top, CARD_WIDTH, CARD_HEIGHT, CORNER_RADIUS);

    const icon = scene.add
      .text(0, -50, '🍷', { fontSize: '110px', padding: { top: 10, bottom: 10 } })
      .setOrigin(0.5);

    const labelText = scene.add
      .text(0, 90, label, {
        fontFamily: FONT_FAMILY,
        fontSize: '30px',
        fontStyle: 'bold',
        color: COLORS.cardText,
        align: 'center',
        wordWrap: { width: CARD_WIDTH - 40 },
      })
      .setOrigin(0.5);

    this.drinkStamp = this.makeStamp(left + 80, top + 50, -15, STRINGS.stampDrink, COLORS.drink);
    this.rejectStamp = this.makeStamp(-left - 80, top + 50, 15, STRINGS.stampReject, COLORS.reject);

    this.add([body, icon, labelText, this.drinkStamp, this.rejectStamp]);
    this.setSize(CARD_WIDTH, CARD_HEIGHT);
    this.setInteractive({ useHandCursor: true });
    scene.add.existing(this);

    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
    const input = scene.input;
    input.on(Phaser.Input.Events.POINTER_MOVE, this.onPointerMove, this);
    input.on(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
    input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onPointerUp, this);
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      input.off(Phaser.Input.Events.POINTER_MOVE, this.onPointerMove, this);
      input.off(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
      input.off(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onPointerUp, this);
    });
  }

  /** Throws the card off-screen in the given direction (also used by the keyboard). */
  swipe(direction: SwipeDirection): void {
    if (this.locked) return;
    this.locked = true;
    this.dragPointerId = null;
    this.disableInteractive();

    const sign = direction === 'right' ? 1 : -1;
    this.drinkStamp.setAlpha(direction === 'right' ? 1 : 0);
    this.rejectStamp.setAlpha(direction === 'left' ? 1 : 0);

    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      x: this.homeX + sign * (this.scene.scale.width + CARD_WIDTH),
      y: this.y + 60,
      angle: sign * 30,
      duration: 300,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.emit('swiped', direction);
        this.destroy();
      },
    });
  }

  private makeStamp(x: number, y: number, angle: number, text: string, color: string) {
    return this.scene.add
      .text(x, y, text, {
        fontFamily: FONT_FAMILY,
        fontSize: '30px',
        fontStyle: 'bold',
        color,
        stroke: color,
        strokeThickness: 1,
        backgroundColor: '#ffffffcc',
        padding: { x: 10, y: 4 },
      })
      .setOrigin(0.5)
      .setAngle(angle)
      .setAlpha(0);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.locked || this.dragPointerId !== null) return;
    this.scene.tweens.killTweensOf([this, this.drinkStamp, this.rejectStamp]);
    this.dragPointerId = pointer.id;
    // Remember where the finger is relative to the card's current offset, so a
    // card grabbed mid-spring-back doesn't jump.
    this.dragStartX = pointer.x - (this.x - this.homeX);
    this.dragStartY = pointer.y - (this.y - this.homeY) / VERTICAL_FOLLOW;
    this.samples = [{ x: pointer.x, t: performance.now() }];
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.dragPointerId) return;

    const dx = pointer.x - this.dragStartX;
    const dy = pointer.y - this.dragStartY;
    this.x = this.homeX + dx;
    this.y = this.homeY + dy * VERTICAL_FOLLOW;
    this.angle = Phaser.Math.Clamp(dx * TILT_PER_PIXEL, -MAX_TILT, MAX_TILT);

    const progress = Phaser.Math.Clamp(Math.abs(dx) / SWIPE_THRESHOLD, 0, 1);
    this.drinkStamp.setAlpha(dx > 0 ? progress : 0);
    this.rejectStamp.setAlpha(dx < 0 ? progress : 0);

    const now = performance.now();
    this.samples.push({ x: pointer.x, t: now });
    while (this.samples.length > 2 && now - this.samples[0].t > VELOCITY_WINDOW_MS) {
      this.samples.shift();
    }
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.dragPointerId) return;
    this.dragPointerId = null;

    const dx = this.x - this.homeX;
    const velocity = this.releaseVelocity();
    const flicked =
      Math.abs(velocity) > FLICK_VELOCITY &&
      Math.sign(velocity) === Math.sign(dx) &&
      Math.abs(dx) > FLICK_MIN_DISTANCE;

    if (Math.abs(dx) > SWIPE_THRESHOLD || flicked) {
      this.swipe(dx > 0 ? 'right' : 'left');
    } else {
      this.springBack();
    }
  }

  private releaseVelocity(): number {
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    if (!first || !last || last.t === first.t) return 0;
    if (performance.now() - last.t > VELOCITY_WINDOW_MS) return 0; // finger paused before release
    return (last.x - first.x) / (last.t - first.t);
  }

  private springBack(): void {
    this.scene.tweens.add({
      targets: this,
      x: this.homeX,
      y: this.homeY,
      angle: 0,
      duration: 350,
      ease: 'Back.easeOut',
    });
    this.scene.tweens.add({
      targets: [this.drinkStamp, this.rejectStamp],
      alpha: 0,
      duration: 150,
    });
  }
}
