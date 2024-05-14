import {UNIVERSE_SIZE} from '@dmxjs/shared';
import {Worker} from 'node:worker_threads';

export function createRS485Worker(path: string) {
	const universeSharedBuffer = new SharedArrayBuffer(UNIVERSE_SIZE);
	const universeBuffer = new Uint8Array(universeSharedBuffer);

	const worker = new Worker(new URL('./worker.js', import.meta.url).pathname, {
		workerData: {
			path,
			universeBuffer,
		},
		stdout: true,
		stderr: true,
	});

	worker.on('online', () => {
		console.log('[RS485] Worker online');
	});

	worker.on('error', error => {
		console.error('[RS485] Worker error:', error);
	});

	worker.on('message', message => {
		console.log('[RS485] Worker message:', message);
	});

	worker.on('exit', code => {
		if (code !== 0) {
			console.error('[RS485] Worker stopped with exit code', code);
		}
	});

	// // This is a bit of a hack to keep the worker running
	// // until the main thread is done. In a real application,
	// // you'd want to have a way to signal to the worker that
	// // it should stop.
	// process.on('exit', () => {
	// 	void worker.terminate();
	// });

	return {
		setUniverseBuffer: (buffer: ArrayLike<number>) => {
			universeBuffer.set(buffer);
		},

		stop: () => {
			worker.terminate();
		},
	};
}
