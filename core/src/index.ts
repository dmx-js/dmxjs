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
	 * Call a function with a handle that WON'T
	 * trigger a commit, but will commit after the
	 * function is done
	 * @param fn The function to call
	 */
	tx: (
		fn: (handle: {
			set: (channel: number, value: number) => void;
			setAll: (value: number) => void;
		}) => void,
	) => void;

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
	const driver = factory();

	const universe = Buffer.alloc(UNIVERSE_SIZE, 0);

	return {
		setAll: (value: number) => {
			for (let i = 0; i <= UNIVERSE_SIZE; i++) {
				universe[i] = value;
			}

			driver.commit(universe);
		},

		set: (channel: number, value: number) => {
			if (channel < 0 || channel > UNIVERSE_SIZE) {
				throw new Error(`Channel ${channel} out of bounds`);
			}

			if (value < 0 || value > MAX_VALUE) {
				throw new Error(`Value ${value} out of bounds`);
			}

			universe[channel - 1] = value;

			driver.commit(universe);
		},

		get: (channel: number) => {
			const value = universe[channel];

			if (value === undefined) {
				throw new Error(`Getting channel ${channel} is out of bounds`);
			}

			return value;
		},

		tx: fn => {
			fn({
				set: (channel, value) => {
					universe[channel - 1] = value;
				},

				setAll: value => {
					for (let i = 0; i <= UNIVERSE_SIZE; i++) {
						universe[i] = value;
					}
				},
			});

			driver.commit(universe);
		},

		stop: async () => {
			await driver.stop();
		},
	};
}
