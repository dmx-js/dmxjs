import type {Color} from '@dmxjs/shared';
import type {FrameLike} from '@dmxjs/shared';

export interface LightingComponent<Frame extends FrameLike> {
	setColor(frame: Frame, color: Color): void;
}
