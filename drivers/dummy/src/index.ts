import type { DriverFactory } from "@dmxjs/shared";

export interface DummyOptions {
  /**
   * An interval in milliseconds at which to log the universe.
   */
  interval?: number;
}

/**
 * The dummy driver simply logs the universe to the console at a given interval.
 * @param options The options for the dummy driver.
 * @returns A driver factory that logs the universe to the console at a given interval.
 */
export function dummy({ interval = 5_000 }: DummyOptions = {}): DriverFactory {
  return (universe) => {
    const timer = setInterval(() => {
      console.log(universe);
    }, interval);

    return async () => {
      clearInterval(timer);
    };
  };
}
