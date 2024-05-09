import type { Manufacturer } from "./manufacturers";

export interface Fixture {
  name: string;
  channels: number;
  manufacturer: Manufacturer;
}

export function fixture(f: Fixture) {
  return f;
}
