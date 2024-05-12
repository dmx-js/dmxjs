import { create } from "@dmxjs/core";
import { autodetect, rs485 } from "@dmxjs/driver-rs485";
import { setTimeout as sleep } from "node:timers/promises";
import { add as unload } from "unload";

import { Controller, Fixtures } from "./src/index.ts";

const path = await autodetect();
console.log("Using path", path);

const dmx = create(rs485(path));

const controller = new Controller(dmx, [new Fixtures.MiniKintaILS()]);

const bpm = 130;

let beat = 0;

const timer = setInterval(() => {
  beat++;

  // Scale to a value of 1-5 for the energy. Maybe go up every 32 beats until we reach 5, then back down
  const energy = Math.floor((Math.sin(beat / 32) + 1) * 2.5) + 1;

  controller.emit("beat", {
    beatInMeasure: (beat % 4) + 1,
    beatInSong: beat + 1,
    measure: Math.floor(beat / 4),
    energy,
    bpm: 120,
  });
}, 60_000 / bpm);

// `unload` is just a separate package that helps with
// cleanup when the process is about to exit. It's not specific
// to @dmxjs/* packages, but it's useful to show in this example since
// it's likely you'll want to do something similar in your own code.
unload(async () => {
  console.log();

  clearInterval(timer);
  dmx.setAll(0);

  console.log("Waiting for zero@*");
  // Wait a little bit of time for
  // the .setAll(0) to be written
  await sleep(100);

  console.log("Stopping DMX");
  await dmx.stop();

  console.log("DMX stopped. Bye bye!");
});
