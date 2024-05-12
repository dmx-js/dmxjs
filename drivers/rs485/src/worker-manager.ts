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
}
