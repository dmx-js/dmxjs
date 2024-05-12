import {MiniKintaILS} from '@dmxjs/fixtures';
import {type MusicContext} from './src';

export class MiniKintaILSDownBeatFlash extends MiniKintaILS<MusicContext> {
	override render(context: MusicContext): Buffer {
		const frame = this.createFrame();

		// Red | Green | Blue | White
		// 0   | 1     | 2    | 3

		const options = ['red', 'green', 'blue', 'white'] as const;

		this.setOption(frame, options[context.beatInMeasure % options.length]!);

		return this.toBuffer(frame);
	}
}
