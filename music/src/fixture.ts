import { TypedMap } from "@dmxjs/shared";
import type { Context } from "./context.ts";

export abstract class Fixture {
  public readonly name: string;
  public readonly channels: number;

  protected static matchEnergy<R>(
    context: Context,
    matches: [() => R, () => R, () => R, () => R, () => R]
  ) {
    return matches[context.energy - 1]!();
  }

  protected constructor(name: string, channels: number) {
    this.name = name;
    this.channels = channels;
  }

  public abstract accept(context: Context): Buffer;
}

export type FixtureEvents = {
  beat: [context: Context];
};

export type FixtureListener<K extends keyof FixtureEvents> = (
  ...args: FixtureEvents[K]
) => void;

export abstract class DynamicFixture extends Fixture {
  private readonly state: Buffer;

  private readonly listeners = new TypedMap<{
    [Key in keyof FixtureEvents]: Set<FixtureListener<Key>>;
  }>();

  protected constructor(name: string, channels: number) {
    super(name, channels);

    this.state = Buffer.alloc(channels, 0);

    this.setup();
  }

  public emit<K extends keyof FixtureEvents>(
    key: K,
    ...args: FixtureEvents[K]
  ) {
    const listeners = this.listeners.get(key);

    if (listeners) {
      for (const listener of listeners) {
        listener(...args);
      }
    }

    return this.state;
  }

  protected on<K extends keyof FixtureEvents>(
    key: K,
    listener: FixtureListener<K>
  ) {
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
