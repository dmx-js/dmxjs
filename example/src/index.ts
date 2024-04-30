import { create } from "@dmxjs/core";
import { rs485 } from "@dmxjs/driver-rs485";

const dmx = create(
  rs485({
    path: "/dev/tty.usbserial-B001TY53",
  })
);

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
