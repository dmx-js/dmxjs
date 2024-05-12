import type {Manufacturer} from './manufacturers';

export interface FixtureMetadata {
	name: string;
	channels: number;
	manufacturer: Manufacturer;
}

export function fixtureMetadata(f: FixtureMetadata) {
	return f;
}
