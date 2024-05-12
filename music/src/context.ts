export enum Energy {
  AMBIENT = 1,
  LOW = 2,
  MEDIUM = 3,
  HIGH = 4,
  BONKERS = 5,
}

export interface Context {
  beatInMeasure: number;
  beatInSong: number;
  measure: number;
  energy: Energy;
  bpm: number;
}

/**
 * Utilities for working with 4/4 time signatures
 */
export const FourFour = {
  isBeatN(context: Context, beat: 1 | 2 | 3 | 4) {
    return context.beatInMeasure % 4 === beat;
  },

  isDownbeat(context: Context) {
    return this.isBeatN(context, 1);
  },
};
