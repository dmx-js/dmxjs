import type { UniverseController } from "@dmxjs/core";
import { UNIVERSE_SIZE } from "@dmxjs/shared";
import { DynamicFixture, type Fixture, type FixtureEvents } from "./fixture";

export class Controller {
  private readonly universe: UniverseController;

  public constructor(
    universe: UniverseController,
    public readonly fixtures: readonly Fixture[]
  ) {
    this.universe = universe;

    let totalChannelCount = 0;

    for (const fixture of fixtures) {
      totalChannelCount += fixture.channels;

      if (totalChannelCount > UNIVERSE_SIZE) {
        throw new Error("Too many channels specified for universe size");
      }
    }
  }

  emit<K extends keyof FixtureEvents>(key: K, ...args: FixtureEvents[K]) {
    for (const fixture of this.fixtures) {
      if (fixture instanceof DynamicFixture) {
        fixture.emit(key, ...args);
      }
    }

    const states = this.fixtures.map((fixture) => fixture.accept(args[0]));

    const concatenated = Buffer.concat(states);

    for (let i = 0; i < concatenated.length; i++) {
      this.universe.set(i + 1, concatenated[i]!);
    }
  }
}
