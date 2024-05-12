import type { Fixture } from "../utils";
import { MiniKintaILS4Channel } from "./mini-kinta-ils";

export const Fixtures = {
  MiniKintaILS4Channel,
} satisfies Record<string, Fixture>;

export type FixtureType = keyof typeof Fixtures;
