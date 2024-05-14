import {bringOnline, type NetworkConfig} from '@dmxjs/prolink-connect';
import {promiseWithTimeout} from '@dmxjs/shared';
import {bold, green, red} from 'colorette';

export class AutoconfigFailureError extends Error {
	constructor(public override readonly message: string) {
		super(message);
	}
}

export interface AutoconfigOptions {
	/**
	 * The timeout in milliseconds for the autoconfig to complete
	 * @default 60,000
	 */
	timeout?: number;

	network?: NetworkConfig;
}

/**
 * Automatically
 * @param config Auto configuration options
 */
export async function autoconfig(config: AutoconfigOptions = {}) {
	const {timeout = 60_000, network: networkConfig} = config;

	const network = await bringOnline(networkConfig);

	network.deviceManager.on('connected', device => {
		console.log(
			green('[Connected]'),
			bold(device.name),
			`id:${device.id}`,
			`(${device.ip.correctForm()})`,
		);
	});

	network.deviceManager.on('disconnected', device => {
		console.log(red('[Disonnected]'), bold(device.name), `(${device.ip.correctForm()})`);
	});

	const autoconfig = await promiseWithTimeout(timeout, network.autoconfigFromPeers());

	if (autoconfig.state === 'timeout') {
		throw new AutoconfigFailureError('Autoconfig timed out waiting for peers to connect');
	}

	network.connect();

	if (!network.isConnected()) {
		throw new AutoconfigFailureError('Autoconfig failed to connect to the network');
	}

	return network;
}
