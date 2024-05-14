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

	setColor(frame: EasyDancingFrame, color: Color) {
		frame[0] = 255; // Max brightness of the whole thing
		frame[1] = color.red;
		frame[2] = color.green;
		frame[3] = color.blue;
	}
}
