import {MiniKintaILS} from '@dmxjs/fixtures';
import {FourFour, type MusicContext} from './src';
import {Color} from '@dmxjs/shared';

export class MiniKintaILSDownBeatFlash extends MiniKintaILS<MusicContext> {
	override render(context: MusicContext): Buffer {
		const frame = this.createFrame();

		if (FourFour.isDownbeat(context)) {
			this.setColor(frame, new Color(255, 255, 255));
		}

		return this.toBuffer(frame);
	}
}
