import type {UniverseController} from '@dmxjs/core';
import {UNIVERSE_SIZE} from '@dmxjs/shared';
import {DynamicFixture, type FixtureEvents} from './fixture';
import type {Fixture} from '@dmxjs/fixtures';
import type {MusicContext} from './music-context.ts';

export class Controller {
	private readonly universe: UniverseController;

	private context: MusicContext | null;

	public constructor(
		universe: UniverseController,
		public readonly fixtures: readonly Fixture<MusicContext, any>[],
	) {
		this.universe = universe;
		this.context = null;

		const channelCount = fixtures.reduce((acc, fixture) => acc + fixture.channels, 0);
		if (channelCount > UNIVERSE_SIZE) {
			throw new Error('Too many channels specified for universe size');
		}

		this.startLoop();
	}

	emit<K extends keyof FixtureEvents>(key: K, ...args: FixtureEvents[K]) {
		for (const fixture of this.fixtures) {
			if (fixture instanceof DynamicFixture) {
				fixture.emit(key, ...args);
			}
		}

		this.context = args[0];

		// const states = this.fixtures.map(fixture => fixture.render(args[0]));
		//
		// const concatenated = Buffer.concat(states);
		//
		// for (let i = 0; i < concatenated.length; i++) {
		// 	this.universe.set(i + 1, concatenated[i]!);
		// }
	}

	private startLoop() {
		setInterval(() => {
			this.render();
		}, 30); // 60fps
	}

	private render() {
		if (!this.context) {
			return; // No context yet, we don't want to start rendering
		}

		const context = this.context;

		// TODO: figure out the most efficient way to do all this
		const states = this.fixtures.map(fixture => fixture.render(context));
		const concatenated = Buffer.concat(states);

		for (let i = 0; i < concatenated.length; i++) {
			this.universe.set(i + 1, concatenated[i]!);
		}
	}
}
