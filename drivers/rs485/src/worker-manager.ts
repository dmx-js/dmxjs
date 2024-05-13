import * as worker_threads from 'node:worker_threads';
import {UNIVERSE_SIZE} from '@dmxjs/shared';

export function createRs485Worker(path: string) {
	console.log('Creating worker');
	// Create the shared buffer
	const universeSharedBuffer = new SharedArrayBuffer(UNIVERSE_SIZE);
	const universeBuffer = new Uint8Array(universeSharedBuffer);

	const worker = new worker_threads.Worker(new URL('./worker.js', import.meta.url).pathname, {
		workerData: {
			path,
			universeBuffer,
		},
		stdout: true,
		stderr: true,
	});

	worker.on('online', () => {
		console.log('Worker online');
	});

	worker.on('error', error => {
		console.error('Worker error:', error);
	});

	worker.on('message', message => {
		console.log('Worker message:', message);
	});

	worker.on('exit', code => {
		if (code !== 0) {
			console.error('Worker stopped with exit code', code);
		}
	});

	// This is a bit of a hack to keep the worker running
	// until the main thread is done. In a real application,
	// you'd want to have a way to signal to the worker that
	// it should stop.
	process.on('exit', () => {
		void worker.terminate();
	});

	console.log('Worker created');

	return universeBuffer;
}