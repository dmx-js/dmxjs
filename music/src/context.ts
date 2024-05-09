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
