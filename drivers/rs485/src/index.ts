import {type DriverFactory} from '@dmxjs/shared';
import * as os from 'node:os';
import {SerialPort} from 'serialport';
import {createRs485Worker} from './worker-manager.ts';

export interface RS485Options {
	/**
	 * The interval in milliseconds to send the DMX signal. Defaults to 30ms.
	 * @warning Often Node.js is not able to set timers with such accuracy. While you can absolutely try to set this to 1ms, there's absolutely zero guarantee that your system will be able to keep up with that.
	 */
	interval?: number;
}

/**
 * Attempts to automatically guess the path
 */
export async function autodetect(): Promise<string> {
	const ports = await SerialPort.list();

	const platform = os.platform();

	const port = ports.find(port => {
		if (platform === 'darwin') {
			return port.path.includes('usbserial');
		} else if (platform === 'linux') {
			return port.path.includes('ttyUSB');
		} else if (platform === 'win32') {
			return port.path.includes('COM');
		} else {
			return false;
		}
	});

	if (!port) {
		throw new Error('No serial port found');
	}

	return port.path;
}

/**
 * Creates a driver factory for the RS485 protocol
 * @param path The path to the serial port
 * @param options The options for the driver
 * @returns A driver factory
 */
export function rs485(path: string, _options: RS485Options = {}): DriverFactory {
	const sharedBuffer = createRs485Worker(path);

	return buffer => {
		// Write the buffer to the shared buffer
		console.log('SETTING BUFFER');
		sharedBuffer.set(buffer);
		Atomics.notify(sharedBuffer, 0, 512);

		return {
			stop: async () => {
				console.log('todo clean up this shit!');
			},
		};
	};

	// const {interval = 30} = options;

	// return universe => {
	// 	const port = new SerialPort({
	// 		path,
	// 		baudRate: 250000,
	// 		dataBits: 8,
	// 		stopBits: 2,
	// 		parity: 'none',
	// 	});
	//
	// 	const set = promisify((options: SetOptions, callback: () => void) =>
	// 		port.set(options, callback),
	// 	);
	//
	// 	let isWriting = false;
	//
	// 	const commit = async () => {
	// 		await set({brk: true, rts: true});
	// 		await sleep(1); // MAB Duration
	// 		await set({brk: false, rts: true});
	//
	// 		const joined = Buffer.concat([Buffer.from([0]), universe]);
	//
	// 		return new Promise<void>(resolve => {
	// 			port.write(joined, 'binary');
	// 			port.drain(() => resolve());
	// 		});
	// 	};
	//
	// 	const timer = setIntervalAsync(async () => {
	// 		if (isWriting) {
	// 			return;
	// 		}
	//
	// 		isWriting = true;
	//
	// 		try {
	// 			await commit();
	// 		} catch (e) {
	// 			console.warn(e);
	// 		} finally {
	// 			isWriting = false;
	// 		}
	// 	}, interval);
	//
	// 	return {
	// 		stop: async () => {
	// 			await clearIntervalAsync(timer);
	// 		},
	// 	};
	// };
}
