import { type Context } from "../context";
import { Fixture } from "../fixture";

type Frame = [number, number, number, number];

type BinaryColor = [boolean, boolean, boolean];

const MAXIMUM_COLOR = 255;
const MINIMUM_COLOR = 0;

class Color {
  private r: number;
  private g: number;
  private b: number;

  public constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  get red() {
    return this.r;
  }

  get blue() {
    return this.b;
  }

  get green() {
    return this.g;
  }

  private static checkColorRange(value: number) {
    if (value < MINIMUM_COLOR || value > MAXIMUM_COLOR) {
      throw new Error(
        `Color value must be between ${MINIMUM_COLOR} and ${MAXIMUM_COLOR}`
      );
    }
  }

  set red(r: number) {
    Color.checkColorRange(r);
    this.r = r;
  }

  set green(g: number) {
    Color.checkColorRange(g);
    this.g = g;
  }

  set blue(b: number) {
    Color.checkColorRange(b);
    this.b = b;
  }

  copy(): Color {
    return new Color(this.r, this.g, this.b);
  }

  roundToBinary(): BinaryColor {
    return [this.r > 127, this.g > 127, this.b > 127];
  }

  add(other: Color): Color {
    return new Color(this.r + other.r, this.g + other.g, this.b + other.b);
  }

  scale(factor: number): Color {
    return new Color(this.r * factor, this.g * factor, this.b * factor);
  }

  static fromRGB(rgb: number): Color {
    return new Color((rgb >> 16) & 0xff, (rgb >> 8) & 0xff, rgb & 0xff);
  }

  toRGB(): number {
    return (this.r << 16) | (this.g << 8) | this.b;
  }

  static fromHex(hex: string): Color {
    if (hex.startsWith("#")) {
      hex = hex.slice(1);
    }

    return Color.fromRGB(parseInt(hex, 16));
  }

  toHex(): string {
    return `#${this.toRGB().toString(16).padStart(6, "0")}`;
  }

  static interpolate(a: Color, b: Color, factor: number): Color {
    return a.scale(1 - factor).add(b.scale(factor));
  }
}

// https://www.chauvetdj.com/wp-content/uploads/2022/05/Mini_Kinta_ILS_QRG_ML6_Rev4.pdf
export class MiniKintaILS extends Fixture {
  public constructor() {
    super("Mini Kinta ILS", 4);
  }

  createFrame(): Frame {
    return [0, 0, 0, 0];
  }

  setColor(frame: Frame, color: Color): Frame {
    const [redOn, blueOn, greenOn] = color.roundToBinary();

    // This device only supports turning each color on and off, and the combination of which colors are activated.
  }

  public accept(ctx: Context) {
    const result = Fixture.matchEnergy(ctx, [
      () => Buffer.from([10, 0, 0, 0]),
      () => Buffer.from([25, 100, 0, 0]),
      () => Buffer.from([40, 150, 0, 0]),
      () => Buffer.from([55, 200, 0, 0]),
      () => Buffer.from([210, 250, 220, 0]),
    ]);

    return result;
  }
}
