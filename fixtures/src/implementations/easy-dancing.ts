import {Fixture} from '../fixture.ts';
import type {LightingComponent} from '../components';
import {FixtureMetadatum} from '../metadata';
import type {Color} from '@dmxjs/shared';

type EasyDancingFrame = [number, number, number, number, number, number, number]; // 7 channels

export abstract class EasyDancing<Context>
	extends Fixture<Context, EasyDancingFrame>
	implements LightingComponent<EasyDancingFrame>
{
	constructor() {
		super(FixtureMetadatum.EasyDancing7Channel);
	}

	override createFrame(): EasyDancingFrame {
		const [_first, ...rest] = super.createFrame();
		// Default to full brightness
		return [255, ...rest];
	}

	/**
	 * Set the brightness of the fixture 0 -> 1
	 * @param frame The frame to set the brightness on
	 * @param brightnessPercentage The brightness percentage to set
	 */
	setBrightness(frame: EasyDancingFrame, brightnessPercentage: number) {
		frame[0] = Math.floor(brightnessPercentage * 255);
	}

	setColor(frame: EasyDancingFrame, color: Color) {
		frame[1] = color.red;
		frame[2] = color.green;
		frame[3] = color.blue;
	}
}
