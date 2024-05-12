import {MAX_VALUE, UNIVERSE_SIZE, type DriverFactory} from '@dmxjs/shared';

/**
 * A controller for a universe
 */
export interface UniverseController {
	/**
	 * Set all channels to the same value
	 * @param value The value to set
	 */
	setAll: (value: number) => void;

	/**
	 * Sets a channel
	 * @param channel The channel (starting at 1)
	 * @param value The value to set
	 */
	set: (channel: number, value: number) => void;

	/**
	 * Gets the value of a channel
	 * @param channel The channel (starting at 1)
	 * @returns The value of that channel
	 */
	get: (channel: number) => number;

	/**
	 * Calls the `.stop()` method of a driver
	 */
	stop: () => Promise<void>;
}

/**
 * Set
 * @param factory The factory to create a dmx instance for
 * @returns A universe controller
 */
export function create(factory: DriverFactory): UniverseController {
	const universe = Buffer.alloc(UNIVERSE_SIZE, 0);
	const driver = factory(universe);

	return {
		setAll: (value: number) => {
			for (let i = 0; i <= UNIVERSE_SIZE; i++) {
				universe[i] = value;
			}
		},

		set: (channel: number, value: number) => {
			if (channel < 0 || channel > UNIVERSE_SIZE) {
				throw new Error(`Channel ${channel} out of bounds`);
			}

			if (value < 0 || value > MAX_VALUE) {
				throw new Error(`Value ${value} out of bounds`);
			}

			universe[channel - 1] = value;
		},

		get: (channel: number) => {
			const value = universe[channel];

			if (value === undefined) {
				throw new Error(`Getting channel ${channel} is out of bounds`);
			}

			return value;
		},

		stop: () => driver.stop(),
	};
}
