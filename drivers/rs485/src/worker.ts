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

async function run() {
	log('I am running!');

	// Read from the shared buffer

	// Copy the shared buffer to a new buffer
	// const universe = Buffer.from(universeBuffer);

	const buf = Buffer.from(universeBuffer);
	log(`buf: ${buf.toString('hex')}`);

	port.write(Buffer.from([0]), 'binary');
	port.write(buf, 'binary');
	await new Promise(res => port.drain(res));
}

while (true) {
	const now = Date.now();

	if (now - lastRan >= TARGET_RUN_MS) {
		lastRan = now;
		await new Promise(res => port.set({brk: false, rts: true}, res));
		await run();
		const after = Date.now();
		const runTook = after - now;
		const diff = TARGET_RUN_MS - runTook;

		// diff until next run
		await new Promise(res => port.set({brk: true, rts: true}, res));
		log(`Run took ${runTook}ms, waiting for ${diff}ms`);
	}
}
