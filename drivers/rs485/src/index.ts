import {type DriverFactory} from '@dmxjs/shared';
import * as os from 'node:os';
import {SerialPort} from 'serialport';
import {createRS485Worker} from './worker-manager.ts';

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
	const {setUniverseBuffer, stop} = createRS485Worker(path);

	return () => {
		return {
			commit: buffer => {
				setUniverseBuffer(buffer);
			},
			stop: async () => {
				stop();
			},
		};
	};
}
