export type Universe = Buffer;

export type DriverFactory = (universe: Universe) => Driver;
export type Driver = {
	stop: () => Promise<void>;
};

export const UNIVERSE_SIZE = 512;
export const MAX_VALUE = 255;

export function deferred<T>(): {
	wait: () => Promise<T>;
	promise: Promise<T>;
	resolve: (value: T) => void;
} {
	let resolve!: (value: T) => void;

	const promise = new Promise<T>(res => {
		resolve = res;
	});

	return {promise, resolve, wait: () => promise};
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function promiseWithTimeout<R>(ms: number, promise: Promise<R>) {
  return Promise.race([
    promise.then((value) => ({ state: "resolved" as const, value })),
    sleep(ms).then(() => ({ state: "timeout" as const })),
  ]);
}

export class TypedMap<T extends Record<PropertyKey, unknown>> {
	private readonly map = new Map<keyof T, T[keyof T]>();

	public set<K extends keyof T>(key: K, value: T[K]) {
		this.map.set(key, value);
	}

	public get<K extends keyof T>(key: K): T[K] | undefined {
		return this.map.get(key) as T[K];
	}

	public delete<K extends keyof T>(key: K) {
		return this.map.delete(key);
	}

	public has<K extends keyof T>(key: K) {
		return this.map.has(key);
	}

	public clear() {
		this.map.clear();
	}

	public values() {
		return this.map.values();
	}

	public keys() {
		return this.map.keys();
	}

	public entries() {
		return this.map.entries();
	}
}

export function printUniverse(universe: Universe) {
	const objectOfNonZeroValues: Record<number, number> = {};

	for (let i = 0; i < universe.length; i++) {
		const value = universe[i];

		if (value !== undefined && value !== 0) {
			objectOfNonZeroValues[i] = value;
		}
	}

	console.table(objectOfNonZeroValues);
}

export type Values<T> = T[keyof T];

export function matchLiteral<
	const T extends PropertyKey,
	const Handlers extends Readonly<Partial<Record<T, unknown>>>,
	const R extends [Exclude<T, keyof Handlers>] extends [never] ? [] : [defaultValue: unknown],
>(
	value: T,
	handlers: Handlers,
	...rest: R
): (Values<Handlers> & {}) | (R extends [infer V] ? V : never) {
	if (value in handlers) {
		return handlers[value] as Values<Handlers> & {};
	}

	if (rest.length === 1) {
		return rest[0] as R extends [infer V] ? V : never;
	}

	throw new Error('No default value specified');
}

export type FrameLike = [number, ...number[]];

export * from './color';
