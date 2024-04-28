import { create } from "@dmxjs/core";
import { rs485 } from "@dmxjs/driver-rs485";

const dmx = create(
  rs485({
    path: "/dev/ttyUSB0",
  })
);

function blackout() {
  dmx.updateAll(0);
}

function strobeOn() {
  dmx.updateAll(255);
}

function strobeOff() {
  dmx.updateAll(0);
}
