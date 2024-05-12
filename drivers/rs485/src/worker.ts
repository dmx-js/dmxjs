const TARGET_RUN_MS = 30;

let lastRan = 0;

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
		console.log(`Run took ${runTook}ms, waiting for ${diff}ms`);
	}
}

function run() {
	console.log('I am running!');

	// Synthetically wait for 10-20ms
	const target = Date.now() + Math.floor(Math.random() * 10) + 10;

	while (Date.now() < target) {
		// Do nothing
	}
}
