import type {MusicContext} from "../music-context.ts";
import {EasyDancing} from "@dmxjs/fixtures";
import {Color} from "@dmxjs/shared";

export class RandomLightEffect extends EasyDancing<MusicContext> {
  constructor() {
    super();
    this.pickRandomBeat();
  }

  private targetBeat = -1;
  private targetColor = Color.random();

  private needsNewTarget: boolean = true;

  override render(ctx: MusicContext): Buffer {
    const frame = this.createFrame();

    if (ctx.beatInMeasure === this.targetBeat) {
      // Turn on!
      this.setBrightness(frame, 1);
      this.setColor(frame, this.targetColor);
      this.needsNewTarget = true;
    } else if (this.needsNewTarget) {
      this.pickRandomBeat();
    }

    return this.toBuffer(frame);
  }

  private pickRandomBeat() {
    this.targetBeat = Math.floor(Math.random() * 4) + 1;
    this.targetColor = Color.random();
    this.needsNewTarget = false;
  }
}