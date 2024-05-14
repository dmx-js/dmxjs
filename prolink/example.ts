import {create} from '@dmxjs/core';
import {autodetect, rs485} from '@dmxjs/driver-rs485';
import {MiniKintaILS} from '@dmxjs/fixtures';
import {Color} from '@dmxjs/shared';
import {autoconfig, type PLContext} from './src';
import {ProLinkController} from './src/controller';

const universe = create(rs485(await autodetect()));

const network = await autoconfig();

class UnderWater extends MiniKintaILS<PLContext> {
	override render(context: PLContext) {
		const frame = this.createFrame();

		const color =
			context.beatInMeasure % 2 === 0 ? Color.fromHex('#ff0000') : Color.fromHex('#000dff');

		this.setColor(frame, color);

		// const beatTimeMs = 60_000 / context.bpm;
		// const offset = this.lightIndex * beatTimeMs;
		// const b = Math.sin((Date.now() + offset) / 300) / 2 + 0.5;
		// this.setBrightness(frame, b * 0.95 + 0.05);

		return this.toBuffer(frame);
	}
}

const controller = new ProLinkController({
	universe,
	network,
	fixtures: [new UnderWater()],
});

console.log('Controller started', controller);
