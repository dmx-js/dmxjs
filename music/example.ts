import { create } from "@dmxjs/core";
import { rs485 } from "@dmxjs/driver-rs485";
import { Energy } from "./src/context";
import { DMXJSMusicController } from "./src/controller";
import { MiniKintaILS4Channel } from "./src/fixtures/mini-kinta-ils";

const kinta = new MiniKintaILS4Channel();

const dmx = create(
  rs485({
    path: "/dev/tty.usbserial-B001TY53",
  })
);

const controller = new DMXJSMusicController(dmx, [kinta]);

let beat = 0;

setInterval(() => {
  beat++;

  controller.emit("beat", {
    beatInMeasure: beat % 4,
    beatInSong: beat,
    measure: Math.floor(beat / 4),
    energy: Energy.MEDIUM,
    bpm: 120,
  });
}, 1000);
