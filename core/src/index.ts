import { MAX_VALUE, UNIVERSE_SIZE, type DriverFactory } from "@dmxjs/shared";

export interface UniverseController {
  setAll: (value: number) => void;
  set: (channel: number, value: number) => void;
  get: (channel: number) => number;
  stop: () => Promise<void>;
}

export function create(factory: DriverFactory): UniverseController {
  const universe = Buffer.alloc(UNIVERSE_SIZE + 1, 0);
  const stop = factory(universe);

  return {
    setAll: (value: number) => {
      for (let i = 1; i <= UNIVERSE_SIZE; i++) {
        universe[i] = value;
      }
    },

    set: (channel: number, value: number) => {
      if (channel < 0 || channel >= UNIVERSE_SIZE) {
        throw new Error(`Channel ${channel} out of bounds`);
      }

      if (value < 0 || value > MAX_VALUE) {
        throw new Error(`Value ${value} out of bounds`);
      }

      universe[channel] = value;
    },

    get: (channel: number) => {
      const value = universe[channel];

      if (value === undefined) {
        throw new Error(`Getting channel ${channel} is out of bounds`);
      }

      return value;
    },

    stop: () => stop(),
  };
}
