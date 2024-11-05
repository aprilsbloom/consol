import { merge } from 'lodash';
import { LogLevel } from './types';
import type { LogType, LoggerOptions } from './types';

export class OptionsManager {
	protected options: LoggerOptions = {
		logLevel: LogLevel.FATAL,
		formats: {
			log: '{time} {level} {message}',
			time: '%Y/%m/%d %H:%M:%S',
		},
		colors: {
			str: {
				success: 'green',
				warning: 'yellow',
				error: 'red',
				fatal: 'red',
				info: 'blue',
				debug: 'gray',
				value: 'gray',
			},
			ansi: {
				success: this.hexToAnsi('#00FF00'),
				warning: this.hexToAnsi('#FFFF00'),
				error: this.hexToAnsi('#FF0000'),
				fatal: this.hexToAnsi('#FF0000'),
				info: this.hexToAnsi('#0000FF'),
				debug: this.hexToAnsi('#808080'),
				value: this.hexToAnsi('#808080'),
			},
		},
		strings: {
			success: 'SUCCESS',
			warning: 'WARNING',
			error: 'ERROR',
			fatal: 'FATAL',
			info: 'INFO',
			debug: 'DEBUG',
		},
	};

	constructor(options: Partial<LoggerOptions> = {}) {
		this.setOptions(options);
	}

	public setOptions(options: Partial<LoggerOptions>) {
		this.options = merge(this.options, options);
		if (options.colors) this.setColors(options.colors);
	}

	// Formats
	public setLogFormat(format: string) {
		this.options.formats.log = format;
	}

	public setTimeFormat(format: string) {
		this.options.formats.time = format;
	}

	// Colors
	private hexToAnsi(hex: string, isBackground: boolean = false): string {
		if (!hex.startsWith('#')) hex = `#${hex}`;
		if (!/^#[0-9A-F]{6}$/i.test(hex)) throw new Error('Invalid hex color string!');

		const r = Number.parseInt(hex.slice(1, 3), 16).toString();
		const g = Number.parseInt(hex.slice(3, 5), 16).toString();
		const b = Number.parseInt(hex.slice(5, 7), 16).toString();

		return `\x1b${isBackground ? '[48' : '[38'};2;${r};${g};${b}m`;
	}

	public setColors(colors: Partial<LoggerOptions['colors']>) {
		this.options.colors = merge(this.options.colors, colors);

		for (const [key, value] of Object.entries(this.options.colors.str) as [LogType, string][]) {
			this.options.colors.ansi[key] = this.hexToAnsi(value);
		}
	}

	public setSuccessColor(color: string) {
		this.options.colors.str.success = color;
		this.options.colors.ansi.success = this.hexToAnsi(color);
	}

	public setWarningColor(color: string) {
		this.options.colors.str.warning = color;
		this.options.colors.ansi.warning = this.hexToAnsi(color);
	}

	public setErrorColor(color: string) {
		this.options.colors.str.error = color;
		this.options.colors.ansi.error = this.hexToAnsi(color);
	}

	public setInfoColor(color: string) {
		this.options.colors.str.info = color;
		this.options.colors.ansi.info = this.hexToAnsi(color);
	}

	public setDebugColor(color: string) {
		this.options.colors.str.debug = color;
		this.options.colors.ansi.debug = this.hexToAnsi(color);
	}
}