import {MiniKintaILS} from '@dmxjs/fixtures';
import {type MusicContext} from './src';
import {Color} from '@dmxjs/shared';

export class MiniKintaILSDownBeatFlash extends MiniKintaILS<MusicContext> {
	override render(_context: MusicContext): Buffer {
		const frame = this.createFrame();

		const color = Color.random();
		this.setColor(frame, color);

		return this.toBuffer(frame);
	}
}
