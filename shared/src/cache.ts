export const CacheResultType = {
	HIT: 1,
	MISS: 2,
} as const;

export type CacheResultType = (typeof CacheResultType)[keyof typeof CacheResultType];

export interface CacheGetHit<T> {
	type: typeof CacheResultType.HIT;
	value: T;
}

export interface CacheGetMiss {
	type: typeof CacheResultType.MISS;
}

export type CacheGetResult<T> = CacheGetHit<T> | CacheGetMiss;

export interface CacheConfig<T> {
	get: () => Promise<CacheGetResult<T>>;
	set: (value: T) => Promise<void>;
	fetch: () => Promise<T>;
}

export async function cache<T>(config: CacheConfig<T>) {
	const result = await config.get();

	if (result.type === CacheResultType.HIT) {
		return result.value;
	}

	const fetched = await config.fetch();
	await config.set(fetched);

	return fetched;
}

/**
 * Stores a map of promises for a given string key, and ensures that only one
 * promise is created for a given key at a time. If a promise is already in
 * flight, the existing promise is returned. Once the promise resolves, the
 * promise is removed from the map so it can be triggered again. The use
 * case is concurrent requests for the same resource, where only one request
 * should be made at a time.
 * @param fetch Function that returns a promise
 * @returns Function that accepts a key and returns a promise, ensuring only one promise is in flight for a given key
 */
export function createPromiseThrottler<T, K = string, A extends unknown[] = []>(options: {
	fetch: (key: K, ...args: A) => Promise<T>;
	key: (...args: A) => K;
}) {
	const inflightPromises = new Map<K, Promise<T>>();

	return (...args: A) => {
		const key = options.key(...args);

		const existing = inflightPromises.get(key);
		if (existing) {
			return existing;
		}

		const promise = options.fetch(key, ...args);
		inflightPromises.set(key, promise);

		promise.then(() => {
			inflightPromises.delete(key);
		});

		return promise;
	};
}
