import type {FixtureMetadata} from './utils.ts';
import type {FrameLike} from '@dmxjs/shared';

export abstract class Fixture<Context, Frame extends FrameLike> {
	public readonly metadata: FixtureMetadata;

	protected constructor(metadata: FixtureMetadata) {
		this.metadata = metadata;
	}

	get channels() {
		return this.metadata.channels;
	}

	get name() {
		return this.metadata.name;
	}

	public createFrame(): Frame {
		// Create an array the length of the channels
		return new Array(this.channels).fill(0) as Frame;
	}

	public toBuffer(frame: Frame): Buffer {
		return Buffer.from(frame);
	}

	public abstract render(context: Context): Buffer;
}
