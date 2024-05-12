import {type FrameLike, TypedMap} from '@dmxjs/shared';
import type {MusicContext} from './music-context.ts';
import {Fixture, type FixtureMetadata} from '@dmxjs/fixtures';

export type FixtureEvents = {
	beat: [context: MusicContext];
};

export type FixtureListener<K extends keyof FixtureEvents> = (...args: FixtureEvents[K]) => void;

export abstract class DynamicFixture<Context, Frame extends FrameLike> extends Fixture<
	Context,
	Frame
> {
	private readonly state: Buffer;

	private readonly listeners = new TypedMap<{
		[Key in keyof FixtureEvents]: Set<FixtureListener<Key>>;
	}>();

	protected constructor(metadata: FixtureMetadata) {
		super(metadata);

		this.state = Buffer.alloc(this.channels, 0);

		this.setup();
	}

	public emit<K extends keyof FixtureEvents>(key: K, ...args: FixtureEvents[K]) {
		const listeners = this.listeners.get(key);

		if (listeners) {
			for (const listener of listeners) {
				listener(...args);
			}
		}

		return this.state;
	}

	protected on<K extends keyof FixtureEvents>(key: K, listener: FixtureListener<K>) {
		const existing = this.listeners.get(key) ?? new Set();

		existing.add(listener);

		this.listeners.set(key, existing);
	}

	protected abstract setup(): void;

	public accept() {
		return this.state;
	}

	public stop() {
		for (const listeners of this.listeners.values()) {
			listeners.clear();
		}
	}

	protected set(channel: number, value: number) {
		if (channel < 0 || channel >= this.channels) {
			throw new Error(`Channel ${channel} out of bounds`);
		}

		this.state[channel] = value;
	}

	protected setAll(value: number) {
		for (let i = 0; i < this.channels; i++) {
			this.state[i] = value;
		}
	}
}
