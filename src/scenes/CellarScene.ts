import Phaser from 'phaser';
import { STRINGS } from '../data/strings';
import { Button } from '../objects/Button';
import { WINES, type Wine } from '../systems/deck';
import { getSeenWineIds } from '../systems/storage';
import { COLORS, FONT_FAMILY } from '../theme';

const LIST_TOP = 140;
const LIST_BOTTOM = 730;
const ROW_WIDTH = 340;
const ROW_HEIGHT = 72;
const ROW_GAP = 12;
const BACK_BUTTON_Y = 785;

const ROW_COLORS = {
  good: 0xfdf6e9,
  bad: 0xe9d2d2,
  unknown: 0x3a0a18,
};

/** The collection: every wine in the game, revealed once it has appeared on a card. */
export class CellarScene extends Phaser.Scene {
  private content!: Phaser.GameObjects.Container;
  private scroll = 0;
  private maxScroll = 0;

  constructor() {
    super('CellarScene');
  }

  create(): void {
    const { width } = this.scale;
    const cx = width / 2;
    const seen = getSeenWineIds();
    const found = WINES.filter((w) => seen.has(w.id)).length;

    this.add
      .text(cx, 55, STRINGS.cellarTitle, {
        fontFamily: FONT_FAMILY,
        fontSize: '40px',
        fontStyle: 'bold',
        color: COLORS.cream,
        padding: { top: 6, bottom: 6 },
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 105, STRINGS.cellarCount(found, WINES.length), {
        fontFamily: FONT_FAMILY,
        fontSize: '20px',
        fontStyle: 'bold',
        color: COLORS.gold,
      })
      .setOrigin(0.5);

    this.content = this.add.container(cx, LIST_TOP);
    WINES.forEach((wine, i) => {
      const y = i * (ROW_HEIGHT + ROW_GAP) + ROW_HEIGHT / 2;
      this.content.add(this.createRow(wine, seen.has(wine.id), y));
    });

    const viewHeight = LIST_BOTTOM - LIST_TOP;
    const contentHeight = WINES.length * (ROW_HEIGHT + ROW_GAP) - ROW_GAP;
    this.maxScroll = Math.max(0, contentHeight - viewHeight);
    this.scroll = 0;

    const maskShape = this.make.graphics();
    maskShape.fillRect(0, LIST_TOP, width, viewHeight);
    this.content.setMask(maskShape.createGeometryMask());

    this.enableScrolling();

    const back = () => this.scene.start('MenuScene');
    new Button(this, cx, BACK_BUTTON_Y, STRINGS.back, back, 'secondary');
    this.input.keyboard?.once('keydown-ESC', back);
  }

  private createRow(wine: Wine, discovered: boolean, y: number): Phaser.GameObjects.Container {
    const left = -ROW_WIDTH / 2;
    const fill = !discovered ? ROW_COLORS.unknown : wine.isGood ? ROW_COLORS.good : ROW_COLORS.bad;

    const bg = this.add.graphics();
    bg.fillStyle(fill, 1);
    bg.fillRoundedRect(left, -ROW_HEIGHT / 2, ROW_WIDTH, ROW_HEIGHT, 14);

    const icon = this.add
      .text(left + 36, 0, !discovered ? '❔' : wine.isGood ? '🍷' : '💀', {
        fontSize: '32px',
        padding: { top: 6, bottom: 6 },
      })
      .setOrigin(0.5);
    if (!discovered) icon.setAlpha(0.4);

    const textColor = discovered ? COLORS.cardText : COLORS.cream;
    const name = this.add
      .text(left + 70, -12, discovered ? wine.name : STRINGS.unknownWine, {
        fontFamily: FONT_FAMILY,
        fontSize: '20px',
        fontStyle: 'bold',
        color: textColor,
      })
      .setOrigin(0, 0.5);

    const details = discovered
      ? `${wine.grape} · ${wine.country} · ${wine.vintage}`
      : STRINGS.unknownWineHint;
    const sub = this.add
      .text(left + 70, 14, details, {
        fontFamily: FONT_FAMILY,
        fontSize: '15px',
        color: textColor,
      })
      .setOrigin(0, 0.5)
      .setAlpha(discovered ? 0.8 : 0.4);

    // Shrink long names/details so they stay inside the row.
    const maxTextWidth = ROW_WIDTH - 70 - 14;
    for (const t of [name, sub]) {
      if (t.width > maxTextWidth) t.setScale(maxTextWidth / t.width);
    }

    return this.add.container(0, y, [bg, icon, name, sub]);
  }

  /** Drag (or mouse wheel) to scroll the list when it's taller than the screen. */
  private enableScrolling(): void {
    let dragStartY: number | null = null;
    let scrollAtStart = 0;

    this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      if (pointer.y < LIST_TOP || pointer.y > LIST_BOTTOM) return;
      dragStartY = pointer.y;
      scrollAtStart = this.scroll;
    });
    this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
      if (dragStartY === null || !pointer.isDown) return;
      this.setScroll(scrollAtStart - (pointer.y - dragStartY));
    });
    this.input.on(Phaser.Input.Events.POINTER_UP, () => (dragStartY = null));
    this.input.on(
      Phaser.Input.Events.POINTER_WHEEL,
      (_pointer: Phaser.Input.Pointer, _over: unknown, _dx: number, dy: number) =>
        this.setScroll(this.scroll + dy * 0.5),
    );
  }

  private setScroll(value: number): void {
    this.scroll = Phaser.Math.Clamp(value, 0, this.maxScroll);
    this.content.y = LIST_TOP - this.scroll;
  }
}
