export type BinaryColor = [boolean, boolean, boolean];

const MAXIMUM_COLOR = 255;
const MINIMUM_COLOR = 0;

export class Color {
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
			throw new Error(`Color value must be between ${MINIMUM_COLOR} and ${MAXIMUM_COLOR}`);
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
		if (hex.startsWith('#')) {
			hex = hex.slice(1);
		}

		return Color.fromRGB(parseInt(hex, 16));
	}

	toHex(): string {
		return `#${this.toRGB().toString(16).padStart(6, '0')}`;
	}

	static interpolate(a: Color, b: Color, factor: number): Color {
		return a.scale(1 - factor).add(b.scale(factor));
	}

	static random(): Color {
		return new Color(
			Math.floor(Math.random() * 256),
			Math.floor(Math.random() * 256),
			Math.floor(Math.random() * 256),
		);
	}
}
