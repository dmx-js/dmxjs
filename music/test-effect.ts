import {MiniKintaILS} from '@dmxjs/fixtures';
import {type MusicContext} from './src';
import {Color} from '@dmxjs/shared';

export class MiniKintaILSDownBeatFlash extends MiniKintaILS<MusicContext> {
	override render(ctx: MusicContext): Buffer {
		const frame = this.createFrame();

		const color = Color.random();
		this.setColor(frame, color);

		// Create a sine wave based on the beat in the song as the speed
		// \frac{\left(\sin\left(\frac{x}{5-\left(z-1\right)}\right)+1\right)}{2}

		const speed = (Math.sin(ctx.beatInMeasure / (5 - (ctx.energy - 1))) + 1) / 2;
		const index = Math.floor(speed * 126);
		this.setMotorIndex(frame, index);

		return this.toBuffer(frame);
	}
}
