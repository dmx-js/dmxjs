import { Manufacturer } from "../manufacturers.ts";
import { fixture } from "../utils.ts";

export const MiniKintaILS4Channel = fixture({
  name: "Mini Kinta ILS (4 channel)",
  manufacturer: Manufacturer.CHAUVET_DJ,
  channels: 4,
});

export const MiniKintaILS8Channel = fixture({
  name: "Mini Kinta ILS (8 channel)",
  manufacturer: Manufacturer.CHAUVET_DJ,
  channels: 8,
});
