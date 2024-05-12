import {parentPort} from 'node:worker_threads';

const TARGET_RUN_MS = 30;

let lastRan = 0;

function log(msg: string) {
	if (!parentPort) {
		console.log(msg);
		// WTf to do here?
		process.exit(-1);
		return;
	}

	parentPort.postMessage(msg);
	console.log(msg);
}

function run() {
	log('I am running!');

	// Synthetically wait for 10-20ms
	const target = Date.now() + Math.floor(Math.random() * 10) + 10;

	while (Date.now() < target) {
		// Do nothing
	}
}

while (true) {
	const now = Date.now();

	if (now - lastRan >= TARGET_RUN_MS) {
		lastRan = now;
		run();
		const after = Date.now();
		const runTook = after - now;
		const diff = TARGET_RUN_MS - runTook;

		// diff until next run
		// todo: send the break signal
		log(`Run took ${runTook}ms, waiting for ${diff}ms`);
	}
}
