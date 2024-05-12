import {
	bringOnline,
	type ConnectedProlinkNetwork,
	type NetworkConfig,
} from '@dmxjs/prolink-connect';
import {promiseWithTimeout} from '@dmxjs/shared';

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

	const autoconfig = await promiseWithTimeout(timeout, network.autoconfigFromPeers());

	if (autoconfig.state === 'timeout') {
		throw new AutoconfigFailureError('Autoconfig timed out waiting for peers to connect');
	}

	network.connect();

	if (!network.isConnected()) {
		throw new AutoconfigFailureError('Autoconfig failed to connect to the network');
	}

	return prolink(network);
}

export function prolink(network: ConnectedProlinkNetwork) {
	network.statusEmitter.on('status', d => {
		console.log(d);
	});
}
