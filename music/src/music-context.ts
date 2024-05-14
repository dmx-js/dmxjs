export enum Energy {
	AMBIENT = 1,
	LOW,
	MEDIUM,
	HIGH,
	BONKERS,
}

export interface MusicContext {
	beatInMeasure: number;
	beatInSong: number;
	measure: number;
	energy: Energy;
	bpm: number;
	lastBeatAt: number;
}

/**
 * Utilities for working with 4/4 time signatures
 */
export const FourFour = {
	isBeatN(context: MusicContext, beat: 1 | 2 | 3 | 4) {
		return context.beatInMeasure % 4 === beat;
	},

	isDownbeat(context: MusicContext) {
		return this.isBeatN(context, 1);
	},

	isUpbeat(context: MusicContext) {
		return this.isBeatN(context, 4);
	},
};
