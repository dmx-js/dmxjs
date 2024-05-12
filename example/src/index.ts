import {create} from '@dmxjs/core';
import {autodetect, rs485} from '@dmxjs/driver-rs485';

const path = await autodetect();

const dmx = create(rs485(path));

function strobeOn() {
	dmx.setAll(255);
}

function strobeOff() {
	dmx.setAll(0);
}

const strobe = setInterval(() => {
	strobeOn();
	setTimeout(strobeOff, 100);
}, 200);

setTimeout(() => {
	clearInterval(strobe);
}, 5000);
