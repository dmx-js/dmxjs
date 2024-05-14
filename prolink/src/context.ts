export interface PLContext {
	bpm: number;
	beatInMeasure: number;
	beatInSong: number;
	energy: Energy;
}

export enum Energy {
	AMBIENT = 1,
	LOW = 2,
	MEDIUM = 3,
	HIGH = 4,
	PEAK = 5,
}
