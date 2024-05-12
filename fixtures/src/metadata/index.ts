import type {FixtureMetadata} from '../utils';
import {MiniKintaILS4Channel} from './mini-kinta-ils';

export const FixtureMetadatum = {
	MiniKintaILS4Channel,
} satisfies Record<string, FixtureMetadata>;

export type FixtureType = keyof typeof FixtureMetadatum;
