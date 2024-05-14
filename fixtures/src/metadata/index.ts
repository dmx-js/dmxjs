import type {FixtureMetadata} from '../utils';
import {MiniKintaILS4Channel} from './mini-kinta-ils';
import {EasyDancing7Channel} from './easy-dancing.ts';

export const FixtureMetadatum = {
	MiniKintaILS4Channel,
	EasyDancing7Channel,
} satisfies Record<string, FixtureMetadata>;

export type FixtureType = keyof typeof FixtureMetadatum;
