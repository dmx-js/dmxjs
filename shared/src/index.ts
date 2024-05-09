export type Universe = Buffer;

export type DriverFactory = (universe: Universe) => Driver;
export type Driver = () => Promise<void>;

export const UNIVERSE_SIZE = 512;
export const MAX_VALUE = 255;

export function deferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
} {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((res) => {
    resolve = res;
  });

  return { promise, resolve };
}

/**
 * @example
 * ```ts
 * const lock = createAsyncLock();
 *
 * await lock.run(async () => {
 *  //
 * });
 *
 * lock.isLocked(); // false
 *
 * void lock.run(async () => {
 * //
 * });
 *
 * lock.isLocked(); // true
 *
 * await lock.flush();
 *
 * lock.isLocked(); // false
 * ```
 */
export function createAsyncLock() {
  let promise: Promise<void> | null = null;

  return {
    async run<T>(fn: () => Promise<T>): Promise<T> {
      if (promise) {
        await promise;
      }

      const result = await fn().finally(() => {
        promise = null;
      });

      return result;
    },
    isLocked() {
      return promise !== null;
    },
    flush: async () => {
      if (promise) {
        await promise;
      }
    },
  };
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
