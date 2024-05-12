import {type Context} from '../context';
import {Fixture} from '../fixture';
import {Color} from '@dmxjs/shared';

type Frame = [number, number, number, number];
type MiniKintaColorOption = 'red' | 'green' | 'blue' | 'white';

// https://www.chauvetdj.com/wp-content/uploads/2022/05/Mini_Kinta_ILS_QRG_ML6_Rev4.pdf
export class MiniKintaILS extends Fixture {
	public constructor() {
		super('Mini Kinta ILS', 4);
	}

	createFrame(): Frame {
		return [0, 0, 0, 0];
	}

	setColor(frame: Frame, color: Color): void {
		const [redOn, blueOn, greenOn] = color.roundToBinary();

		// Turn into a color enable array
		const options = new Set<MiniKintaColorOption>();
		if (redOn) {
			options.add('red');
		}

		if (blueOn) {
			options.add('blue');
		}

		if (greenOn) {
			options.add('green');
		}

		this.enableColors(frame, Array.from(options));
	}

	enableColors(frame: Frame, miniKintaColorOptions: MiniKintaColorOption[]): void {
		// All color data is inside of channel 0
		// Deduplicate colors
		const set = new Set(miniKintaColorOptions);

		if (set.size === 0) {
			frame[0] = 0;
			return;
		}

		if (set.size === 1) {
			const color = set.values().next().value;

			switch (color) {
				case 'red':
					frame[0] = 10;
					break;
				case 'green':
					frame[0] = 25;
					break;
				case 'blue':
					frame[0] = 40;
					break;
				case 'white':
					frame[0] = 55;
					break;
			}

			return;
		}

		if (set.size === 2) {
			if (set.has('red') && set.has('green')) {
				frame[0] = 70;
			} else if (set.has('red') && set.has('blue')) {
				frame[0] = 85;
			} else if (set.has('red') && set.has('white')) {
				frame[0] = 100;
			} else if (set.has('green') && set.has('blue')) {
				frame[0] = 115;
			} else if (set.has('green') && set.has('white')) {
				frame[0] = 130;
			} else if (set.has('blue') && set.has('white')) {
				frame[0] = 145;
			}

			return;
		}

		if (set.size === 3) {
			if (set.has('red') && set.has('green') && set.has('blue')) {
				frame[0] = 160;
			} else if (set.has('red') && set.has('green') && set.has('white')) {
				frame[0] = 175;
			} else if (set.has('red') && set.has('blue') && set.has('white')) {
				// This case is not supported for the device.
				// TODO: Have a one-shot warning system for stuff like this.
				console.warn('Mini Kinta ILS does not support red, blue, and white at the same time');
			} else if (set.has('green') && set.has('blue') && set.has('white')) {
				frame[0] = 195;
			}

			return;
		}

		if (set.size === 4) {
			frame[0] = 210;
			return;
		}

		// This case is not supported for the device.
		return;
	}

	public accept(ctx: Context) {
		const frame = this.createFrame();

		const color = Color.fromHex('#ff0000');

		if (ctx.beatInMeasure % 2 === 0) {
			color.red = 0;
		}

		this.setColor(frame, color);

		return Buffer.from(frame);

		// const result = Fixture.matchEnergy(ctx, [
		// 	() => Buffer.from([10, 0, 0, 0]),
		// 	() => Buffer.from([25, 100, 0, 0]),
		// 	() => Buffer.from([40, 150, 0, 0]),
		// 	() => Buffer.from([55, 200, 0, 0]),
		// 	() => Buffer.from([210, 250, 220, 0]),
		// ]);

		// return result;
	}
}
