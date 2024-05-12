import type {FrameLike} from '@dmxjs/shared';

/**
 * Represents a component that can be selected from a list of options.
 * Whereby only one of the options can be selected at a time.
 * Sometimes, systems create multiple states based on one enum value, and are just
 * in a larger list. In that case, you can still use this to represent the last-mile state,
 * using a wider option pool.
 */
export interface EnumSelectable<
	Frame extends FrameLike,
	Options extends {[key in number]: string},
> {
	setOption<K extends keyof Options>(frame: Frame, channel: K, option: Options[K]): void;
}

export interface MultiEnumSelectable<
	Frame extends FrameLike,
	Options extends Record<string, string[]>,
> {
	setOptions<K extends keyof Options>(frame: Frame, channel: K, options: Options[K]): void;
}
