import {type MusicContext} from './src';
import {EasyDancing} from '@dmxjs/fixtures';
import {Color} from "@dmxjs/shared";

export class EasyDancingTestEffect extends EasyDancing<MusicContext> {

	private static readonly COLORS: Color[] = [
		new Color(255, 0, 0),
		new Color(0, 255, 0),
		new Color(0, 0, 255),
		new Color(255, 255, 0),
	];

	private readonly color: Color;

	constructor(private readonly targetBeat: number) {
		super();

		this.color = EasyDancingTestEffect.COLORS[targetBeat - 1]!;
	}

	override render(ctx: MusicContext): Buffer {
		const frame = this.createFrame();

		const time = Date.now();

		const nextBeatNum = this.targetBeat + 1 > 4 ? 1 : this.targetBeat + 1;
		const beatTimeMs = 60_000 / ctx.bpm;

		// We want to transition our brightness from 0.2 to 1.0 over the course of the beat
		if (ctx.beatInMeasure === nextBeatNum) {
			// Fade out
			const timeSinceBeat = time - ctx.lastBeatAt;
			const progress = timeSinceBeat / beatTimeMs;

			this.setBrightness(frame, 1 - progress);
		} else if (ctx.beatInMeasure === this.targetBeat) {
			const timeSinceBeat = time - ctx.lastBeatAt;
			const progress = timeSinceBeat / beatTimeMs;

			this.setBrightness(frame, progress);
		}
		else {
			this.setBrightness(frame, 0);
		}

		this.setColor(frame, this.color);

		return this.toBuffer(frame);
	}
}
