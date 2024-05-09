import type { Fixture } from "../utils";
import { MiniKintaILS4Channel, MiniKintaILS8Channel } from "./mini-kinta-ils";

export const Fixtures = {
  MiniKintaILS4Channel,
  MiniKintaILS8Channel,
} satisfies Record<string, Fixture>;
