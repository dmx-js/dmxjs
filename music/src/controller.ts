import type {UniverseController} from '@dmxjs/core';
import type {Fixture} from '@dmxjs/fixtures';
import {UNIVERSE_SIZE, type FrameLike} from '@dmxjs/shared';
import {DynamicFixture, type FixtureEvents} from './fixture.ts';
import type {MusicContext} from './music-context.ts';

export class MusicController {
	private readonly universe: UniverseController;
	private readonly fixtures: readonly Fixture<MusicContext, FrameLike>[];
	private context: MusicContext | null;

	private timer: ReturnType<typeof setInterval> | null = null;

	private static isValidFixtureWidth(fixtures: readonly Fixture<MusicContext, FrameLike>[]) {
		const channelCount = fixtures.reduce((acc, fixture) => acc + fixture.channels, 0);
		return channelCount > UNIVERSE_SIZE;
	}

	public constructor(
		universe: UniverseController,
		fixtures: readonly Fixture<MusicContext, FrameLike>[],
	) {
		if (!MusicController.isValidFixtureWidth(fixtures)) {
			throw new Error('Too many channels specified for universe size');
		}

		this.context = null;
		this.universe = universe;
		this.fixtures = fixtures;

		this.startLoop();
	}

	public emit<K extends keyof FixtureEvents>(key: K, ...args: FixtureEvents[K]) {
		switch (key) {
			case 'beat': {
				const [context] = args;

				for (const fixture of this.fixtures) {
					if (fixture instanceof DynamicFixture) {
						fixture.emit(key, context);
					}
				}

				this.context = context;

				// Start the loop if it's not already running
				this.startLoop();

				break;
			}
		}
	}

	public startLoop() {
		if (this.timer) {
			return;
		}

		this.timer = setInterval(() => {
			this.render();
		}, 30);
	}

	public stopLoop() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}

	private render() {
		const context = this.context;

		if (!context) {
			// No context yet, we don't want to start rendering
			return;
		}

		const states = this.fixtures.map(fixture => fixture.render(context));
		const concatenated = Buffer.concat(states);

		for (let i = 0; i < concatenated.length; i++) {
			this.universe.set(i + 1, concatenated[i]!);
		}
	}
}
