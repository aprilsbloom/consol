import { merge } from 'lodash';
import { hexToAnsi } from './utils';
import { LogLevel } from './enums';
import type { LogType, LoggerOptions } from './types';

export class OptionsManager {
	protected options: LoggerOptions = {
		logLevel: LogLevel.Fatal,
		formats: {
			log: "!{date} !{colors.level}!{level}!{colors.reset} !{message}",
			date: '%Y/%m/%d %H:%M:%S',
			altDate: '%Y-%m-%d',
		},
		colors: {
			info: {
				hex: '#a8a8a8',
			},
			success: {
				hex: '#79ef77',
			},
			warning: {
				hex: '#efe777',
			},
			error: {
				hex: '#ef8d77',
			},
			fatal: {
				hex: '#ef8d77',
			},
			debug: {
				hex: '#a8a8a8',
			},
			reset: '\x1b[0m',
		},
		strings: {
			info: 'INFO',
			success: 'SUCCESS',
			warning: 'WARNING',
			error: 'ERROR',
			fatal: 'FATAL',
			debug: 'DEBUG',
		},
	};

	constructor(options: Partial<LoggerOptions> = {}) {
		this.setOptions(options);
	}

	public setOptions(options: Partial<LoggerOptions>) {
		if (options.colors?.ansi) {
			(options.colors.ansi as any) = undefined;
		}

		this.options = merge(this.options, options);
		if (this.options.colors) this.setColors(this.options.colors);
	}

	// Log level
	public setLogLevel(level: LogLevel) {
		this.options.logLevel = level;
	}

	// Formats
	public setFormats(formats: Partial<LoggerOptions['formats']>) {
		this.options.formats = merge(this.options.formats, formats);
	}

	public setLogFormat(format: string) {
		this.options.formats.log = format;
	}

	public setDateFormat(format: string) {
		this.options.formats.date = format;
	}

	public setAltDateFormat(format: string) {
		this.options.formats.altDate = format;
	}

	// Colors
	public setColors(colors: Partial<LoggerOptions['colors']>) {
		this.options.colors = merge(this.options.colors, colors);

		for (const key of Object.keys(this.options.colors)) {
			this.setColor(key, this.options.colors[key]?.hex);
		}
	}

	private setColor(type: keyof LoggerOptions['colors'], color: string) {
		if (!type || !color) return;
		if (typeof this.options.colors[type] === 'string') return;
		this.options.colors[type] = {
			hex: color,
			ansi: hexToAnsi(color),
		}
	}

	public setInfoColor(color: string) {
		this.setColor('info', color);
	}

	public setSuccessColor(color: string) {
		this.setColor('success', color);
	}

	public setWarningColor(color: string) {
		this.setColor('warning', color);
	}

	public setErrorColor(color: string) {
		this.setColor('error', color);
	}

	public setFatalColor(color: string) {
		this.setColor('fatal', color);
	}

	public setDebugColor(color: string) {
		this.setColor('debug', color);
	}

	// Strings
	public setStrings(strings: Partial<LoggerOptions['strings']>) {
		this.options.strings = merge(this.options.strings, strings);
	}

	public setInfoString(str: string) {
		this.options.strings.info = str;
	}

	public setSuccessString(str: string) {
		this.options.strings.success = str;
	}

	public setWarningString(str: string) {
		this.options.strings.warning = str;
	}

	public setErrorString(str: string) {
		this.options.strings.error = str;
	}

	public setFatalString(str: string) {
		this.options.strings.fatal = str;
	}

	public setDebugString(str: string) {
		this.options.strings.debug = str;
	}
}
