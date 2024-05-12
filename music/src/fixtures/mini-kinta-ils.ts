import { type Context } from "../context";
import { Fixture } from "../fixture";

// https://www.chauvetdj.com/wp-content/uploads/2023/05/Rotosphere_HP_UM_Rev1.pdf
export class MiniKintaILS extends Fixture {
  public constructor() {
    super("Mini Kinta ILS", 4);
  }

  public accept(ctx: Context) {
    const result = Fixture.matchEnergy(ctx, [
      () => Buffer.from([10, 0, 0, 0]),
      () => Buffer.from([25, 100, 0, 0]),
      () => Buffer.from([40, 150, 0, 0]),
      () => Buffer.from([55, 200, 0, 0]),
      () => Buffer.from([210, 250, 220, 0]),
    ]);

    console.log({ result });

    return result;
  }
}
