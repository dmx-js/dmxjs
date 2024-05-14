import type {ConnectedProlinkNetwork} from '@dmxjs/prolink-connect';
import {CacheResultType, cache, createPromiseThrottler} from '@dmxjs/shared';
import objectHash from 'object-hash';

export type GetMetadataOptions = Parameters<ConnectedProlinkNetwork['db']['getWaveforms']>[0];
export type PhraseStoreValue = NonNullable<
	Awaited<ReturnType<ConnectedProlinkNetwork['db']['getWaveforms']>>
>;

export class PhraseStore {
	private readonly network: ConnectedProlinkNetwork;
	private readonly map: Map<string, PhraseStoreValue> = new Map();

	public readonly resolve = createPromiseThrottler({
		key: (options: GetMetadataOptions) => this.toKey(options),

		fetch: (key, options) => {
			return cache<PhraseStoreValue>({
				fetch: async () => {
					const waveform = await this.network.db.getWaveforms(options);

					if (!waveform) {
						throw new Error('Metadata not found');
					}

					return waveform;
				},

				set: async value => {
					this.map.set(key, value);
				},

				get: async () => {
					const value = this.map.get(key);

					if (value) {
						return {
							type: CacheResultType.HIT,
							value,
						};
					} else {
						return {
							type: CacheResultType.MISS,
						};
					}
				},
			});
		},
	});

	public constructor(network: ConnectedProlinkNetwork) {
		this.network = network;
	}

	private toKey(options: GetMetadataOptions) {
		return objectHash(options, {
			unorderedArrays: true,
			unorderedObjects: true,
			unorderedSets: true,
		});
	}
}
