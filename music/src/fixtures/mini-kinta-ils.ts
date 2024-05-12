import { FourFour, type Context } from "../context";
import { Fixture } from "../fixture";

export class MiniKintaILS extends Fixture {
  public constructor() {
    super("Mini Kinta ILS", 4);
  }

  public accept(ctx: Context) {
    if (FourFour.isDownbeat(ctx)) {
      return Buffer.from([30, 0, 0, 0]);
    } else {
      return Buffer.from([240, 255, 0, 0]);
    }
  }
}
