import { Color } from "@dmxjs/shared";
import type {MusicContext} from "../music-context.ts";
import {EasyDancing} from "@dmxjs/fixtures";

export class StrobeInsanity extends EasyDancing<MusicContext> {

  constructor(private readonly lightIndex: number) {
    super();
  }

  override render(context: MusicContext) {
    const frame = this.createFrame();

    const time = Date.now();

    // We want to pick a target speed between 120 and (120 * 8) ms, based on the time
    const targetSpeedMs = Math.floor(((Math.sin(time / 1000) + 1) / 2) * (120 * 7) + 120);

    if (this.lightIndex === 0) {
      console.log('Target speed:', targetSpeedMs);
    }

    // We want to strobe at a rate of 1 / targetSpeedMs
    const strobeTime = time % targetSpeedMs;

    const strobeOn = strobeTime < targetSpeedMs / 2;

    this.setBrightness(frame, strobeOn ? 1 : 0);

    this.setColor(frame, new Color(255, 255, 255));

    return this.toBuffer(frame);
  }
}