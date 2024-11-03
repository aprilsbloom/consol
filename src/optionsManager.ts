import { merge } from 'lodash';
import type { LoggerOptions } from './types';

export class OptionsManager {
	protected options: LoggerOptions = {
		timeFormat: '%Y/%m/%d %H:%M:%S',
		colors: {
			str: {
				success: 'green',
				warning: 'yellow',
				error: 'red',
				info: 'blue',
				debug: 'gray',
				value: 'gray',
			}
		},
	};

	constructor(options: Partial<LoggerOptions> = {}) {
		this.options = merge(this.options, options);
	}

	public setOptions(options: Partial<LoggerOptions>) {
		this.options = merge(this.options, options);
	}

	// Time
	public setTimeFormat(format: string) {
		this.options.timeFormat = format;
	}

	// Colors
	public setColors(colors: Partial<LoggerOptions['colors']>) {
		this.options.colors = merge(this.options.colors, colors);
	}

	public setSuccessColor(color: string) {
		this.options.colors.success = color;
	}

	public setWarningColor(color: string) {
		this.options.colors.warning = color;
	}

	public setErrorColor(color: string) {
		this.options.colors.error = color;
	}

	public setInfoColor(color: string) {
		this.options.colors.info = color;
	}

	public setDebugColor(color: string) {
		this.options.colors.debug = color;
	}
}