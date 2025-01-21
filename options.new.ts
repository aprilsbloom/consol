import { LogLevel } from './old/enums';
import type { Theme } from 'cli-highlight';
import { merge } from 'lodash';

export interface ConsolOptions {
	enabled: boolean;
	paused: boolean;
	level: LogLevel;
	stringify: StringifyOptions;
}

export interface StringifyOptions {
	indent: number;
	themes: Record<string, Theme>;
}

export class NewOptions {
	public opts: ConsolOptions = {
		enabled: true,
		paused: false,
		level: LogLevel.Info,

		stringify: {
			indent: 2,
			themes: {},
		},
	};

	constructor(opts: Partial<ConsolOptions>) {
		this.opts = merge(this.opts, opts);
	}

}
