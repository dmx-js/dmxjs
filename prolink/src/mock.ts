import type {PLContext} from './context';

export function mockEmitter(bpm: number, emit: (context: PLContext) => void) {
	let beat = 0;

	const timer = setInterval(() => {
		beat++;

		// Scale to a value of 1-5 for the energy. Maybe go up every 32 beats until we reach 5, then back down
		const energy = Math.floor((Math.sin(beat / 32) + 1) * 2.5) + 1;

		emit({
			bpm,
			beatInMeasure: (beat % 4) + 1,
			beatInSong: beat + 1,
			energy,
		});
	}, 60_000 / bpm);

	return {
		stop: () => {
			clearInterval(timer);
		},
	};
}
