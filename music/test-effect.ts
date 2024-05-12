import {MiniKintaILS} from '@dmxjs/fixtures';
import {type MusicContext} from './src';
import {Color} from '@dmxjs/shared';

export class MiniKintaILSDownBeatFlash extends MiniKintaILS<MusicContext> {
	override render(_context: MusicContext): Buffer {
		const frame = this.createFrame();

		// Red | Green | Blue | White
		// 0   | 1     | 2    | 3

		// const options = ['red', 'green', 'blue', 'white'] as const;
		//
		// this.setOption(frame, options[context.beatInMeasure % options.length]!);

		const color = Color.random();
		this.setColor(frame, color);

		return this.toBuffer(frame);
	}
}
