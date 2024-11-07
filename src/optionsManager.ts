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
			str: {
				info: '#a8a8a8',
				success: '#79ef77',
				warning: '#efe777',
				error: '#ef8d77',
				fatal: '#ef8d77',
				debug: '#a8a8a8',
			},
			ansi: {
				reset: '\x1b[0m',
			},
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

		for (const [key, value] of Object.entries(this.options.colors.str) as [LogType, string][]) {
			this.options.colors.ansi[key] = hexToAnsi(value);
		}
	}

	public setInfoColor(color: string) {
		this.options.colors.str.info = color;
		this.options.colors.ansi.info = hexToAnsi(color);
	}

	public setSuccessColor(color: string) {
		this.options.colors.str.success = color;
		this.options.colors.ansi.success = hexToAnsi(color);
	}

	public setWarningColor(color: string) {
		this.options.colors.str.warning = color;
		this.options.colors.ansi.warning = hexToAnsi(color);
	}

	public setErrorColor(color: string) {
		this.options.colors.str.error = color;
		this.options.colors.ansi.error = hexToAnsi(color);
	}

	public setFatalColor(color: string) {
		this.options.colors.str.fatal = color;
		this.options.colors.ansi.fatal = hexToAnsi(color);
	}

	public setDebugColor(color: string) {
		this.options.colors.str.debug = color;
		this.options.colors.ansi.debug = hexToAnsi(color);
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
