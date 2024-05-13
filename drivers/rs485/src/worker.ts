import {parentPort, workerData} from 'node:worker_threads';
import {SerialPort} from 'serialport';

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

const {path: usbPath, universeBuffer} = workerData as {
	path: string;
	universeBuffer: SharedArrayBuffer;
};
if (!usbPath) {
	throw new Error("No 'path' provided in workerData");
}

const port = new SerialPort({
	path: usbPath,
	baudRate: 250000,
	dataBits: 8,
	stopBits: 2,
	parity: 'none',
});

function run() {
	log('I am running!');

	// Read from the shared buffer

	// Copy the shared buffer to a new buffer
	// const universe = Buffer.from(universeBuffer);

	port.write(Buffer.from([0]), 'binary');
	port.write(Buffer.from(universeBuffer), 'binary');
	port.drain();
}

while (true) {
	const now = Date.now();

	if (now - lastRan >= TARGET_RUN_MS) {
		lastRan = now;
		port.set({brk: false, rts: true});
		run();
		const after = Date.now();
		const runTook = after - now;
		const diff = TARGET_RUN_MS - runTook;

		// diff until next run
		port.set({brk: true, rts: true});
		log(`Run took ${runTook}ms, waiting for ${diff}ms`);
	}
}
