import * as worker_threads from 'node:worker_threads';

export function createRs485Worker(path: string) {
	const worker = new worker_threads.Worker(new URL('./worker.ts', import.meta.url).pathname, {
		workerData: {
			path,
		},
	});

	// Print all stdout from the worker
	worker.stdout.pipe(process.stdout);
	// Print all stderr from the worker
	worker.stderr.pipe(process.stderr);

	return {
		set: (channel: number, value: number) => {
			worker.postMessage({type: 'set', channel, value});
		},

		get: (channel: number) => {
			worker.postMessage({type: 'get', channel});
		},

		stop: () => {
			worker.postMessage({type: 'stop'});
		},
	};
}
