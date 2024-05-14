import {type MusicContext} from './src';
import {Color} from '@dmxjs/shared';
import {EasyDancing} from '@dmxjs/fixtures';

export class EasyDancingTestEffect extends EasyDancing<MusicContext> {
	override render(_ctx: MusicContext): Buffer {
		const frame = this.createFrame();

		const color = Color.random();
		this.setColor(frame, color);

		return this.toBuffer(frame);
	}
}
