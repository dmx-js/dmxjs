import {Fixture} from '../fixture';
import {Color} from '@dmxjs/shared';
import {FixtureMetadatum} from '../metadata';
import type {LightingComponent} from '../components';
import type {EnumSelectable, MultiEnumSelectable} from '../components';

type MiniKintaFrame = [number, number, number, number];
type MiniKintaColorOption = 'red' | 'green' | 'blue' | 'white';

const MiniKintaILSEnumMapping = {
	off: 0,
	red: 10,
	green: 25,
	blue: 40,
	white: 55,
	red_green: 70,
	red_blue: 85,
	red_white: 100,
	green_blue: 115,
	green_white: 130,
	blue_white: 145,
	red_green_blue: 160,
	red_green_white: 175,
	red_blue_white: 190,
	green_blue_white: 205,
	red_green_blue_white: 210,
	automatic_4_color_chase: 225,
	automatic_7_color_chase: 240,
} as const;

// https://www.chauvetdj.com/wp-content/uploads/2022/05/Mini_Kinta_ILS_QRG_ML6_Rev4.pdf
export abstract class MiniKintaILS<Context>
	extends Fixture<Context, MiniKintaFrame>
	implements
		LightingComponent<MiniKintaFrame>,
		EnumSelectable<MiniKintaFrame, keyof typeof MiniKintaILSEnumMapping>,
		MultiEnumSelectable<MiniKintaFrame, MiniKintaColorOption>
{
	public constructor() {
		super(FixtureMetadatum.MiniKintaILS4Channel);
	}

	setColor(frame: MiniKintaFrame, color: Color): void {
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

		this.setOptions(frame, Array.from(options));
	}

	setOptions(frame: MiniKintaFrame, options: MiniKintaColorOption[]) {
		// All color data is inside of channel 0
		// Deduplicate colors
		const set = new Set(options);

		if (set.size === 0) {
			frame[0] = 0;
			return;
		}

		if (set.size === 1) {
			const color = set.values().next().value;

			switch (color) {
				case 'red':
					this.setOption(frame, 'red');
					break;
				case 'green':
					this.setOption(frame, 'green');
					break;
				case 'blue':
					this.setOption(frame, 'blue');
					break;
				case 'white':
					this.setOption(frame, 'white');
					break;
			}

			return;
		}

		if (set.size === 2) {
			if (set.has('red') && set.has('green')) {
				this.setOption(frame, 'red_green');
			} else if (set.has('red') && set.has('blue')) {
				this.setOption(frame, 'red_blue');
			} else if (set.has('red') && set.has('white')) {
				this.setOption(frame, 'red_white');
			} else if (set.has('green') && set.has('blue')) {
				this.setOption(frame, 'green_blue');
			} else if (set.has('green') && set.has('white')) {
				this.setOption(frame, 'green_white');
			} else if (set.has('blue') && set.has('white')) {
				this.setOption(frame, 'blue_white');
			}

			return;
		}

		if (set.size === 3) {
			if (set.has('red') && set.has('green') && set.has('blue')) {
				this.setOption(frame, 'red_green_blue');
			} else if (set.has('red') && set.has('green') && set.has('white')) {
				this.setOption(frame, 'red_green_white');
			} else if (set.has('red') && set.has('blue') && set.has('white')) {
				// This case is not supported for the device.
				// TODO: Have a one-shot warning system for stuff like this.
				console.warn('Mini Kinta ILS does not support red, blue, and white at the same time');
			} else if (set.has('green') && set.has('blue') && set.has('white')) {
				this.setOption(frame, 'green_blue_white');
			}

			return;
		}

		if (set.size === 4) {
			if (set.has('red') && set.has('green') && set.has('blue') && set.has('white')) {
				this.setOption(frame, 'red_green_blue_white');
			}
			return;
		}

		// This case is not supported for the device.
		return;
	}

	setOption(frame: MiniKintaFrame, option: keyof typeof MiniKintaILSEnumMapping) {
		frame[0] = MiniKintaILSEnumMapping[option];
	}
}
