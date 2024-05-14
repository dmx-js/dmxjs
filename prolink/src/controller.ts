import type {UniverseController} from '@dmxjs/core';
import type {Fixture} from '@dmxjs/fixtures';
import type {ConnectedProlinkNetwork} from '@dmxjs/prolink-connect';
import {UNIVERSE_SIZE, type FrameLike} from '@dmxjs/shared';
import {Energy, type PLContext} from './context.ts';
import {PhraseStore} from './phrase-store.ts';

export class ProLinkController {
	private readonly universe: UniverseController;
	private readonly fixtures: readonly Fixture<PLContext, FrameLike>[];
	private readonly network: ConnectedProlinkNetwork;

	private timer: ReturnType<typeof setInterval> | null = null;
	private currentContext: PLContext | null = null;

	private readonly phraseStore: PhraseStore;

	private static isValidFixtureWidth(fixtures: readonly Fixture<PLContext, FrameLike>[]) {
		const channelCount = fixtures.reduce((acc, fixture) => acc + fixture.channels, 0);
		return channelCount <= UNIVERSE_SIZE;
	}

	public constructor(options: {
		universe: UniverseController;
		network: ConnectedProlinkNetwork;
		fixtures: readonly Fixture<PLContext, FrameLike>[];
	}) {
		const {universe, network, fixtures} = options;

		if (!ProLinkController.isValidFixtureWidth(fixtures)) {
			throw new Error('Too many channels specified for universe size');
		}

		this.universe = universe;
		this.fixtures = fixtures;
		this.network = network;

		this.phraseStore = new PhraseStore(network);

		this.startLoop();
	}

	public getPhraseStore() {
		return this.phraseStore;
	}

	public startLoop() {
		if (this.timer) {
			return;
		}

		this.timer = setInterval(() => {
			this.render();
		}, 30);

		this.network.statusEmitter.on('status', async status => {
			if (status.trackBPM === null || status.beat === null) {
				return;
			}

			// Maybe change this, but for now we only want to
			// listen to the master track
			if (!status.isMaster) {
				return;
			}

			this.currentContext = {
				bpm: status.trackBPM,
				beatInMeasure: status.beatInMeasure,
				beatInSong: status.beat,

				// TODO: Figure out how to read this
				energy: Energy.MEDIUM,
			};
		});
	}

	public stopLoop() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}

	private render() {
		const context = this.currentContext;

		if (!context) {
			// No context yet, we don't want to start rendering
			return;
		}

		const concatenated = Buffer.concat(this.fixtures.map(fixture => fixture.render(context)));

		this.universe.tx(handle => {
			for (let i = 0; i < concatenated.length; i++) {
				handle.set(i + 1, concatenated[i]!);
			}
		});
	}
}
