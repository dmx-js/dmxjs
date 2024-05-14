import type {DriverFactory} from '@dmxjs/shared';

/**
 * The dummy driver simply logs the universe to the console every time it is commited
 * @returns A driver factory that logs the universe
 */
export function dummy(): DriverFactory {
	return () => {
		return {
			commit: universe => {
				console.log('[dummy] commiting', universe.length, universe);
			},
			stop: async () => {
				// No cleanup required for the dummy driver
			},
		};
	};
}
