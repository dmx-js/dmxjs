import type { Context } from "../context";
import { Fixture } from "../fixture";

export class MiniKintaILS4Channel extends Fixture {
  public constructor() {
    super("Mini Kinta ILS", 4);
  }

  public accept(state: Context) {
    if (state.beatInMeasure % 4 === 1) {
      return Buffer.from([255, 255, 255, 255]);
      // return Buffer.from([216, 0, 10, 0]);
    } else {
      return Buffer.from([255, 255, 255, 255]);
      // return Buffer.from([0, 0, 10, 0]);
    }
  }
}
