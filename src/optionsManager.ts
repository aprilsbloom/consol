import { merge } from 'lodash';
import strftime from 'strftime';
import { mkdirSync, writeFileSync } from 'node:fs';

import { LogLevel, logTypeToLogLevel } from './enums';
import { hexToAnsi } from './utils';
import type { Format, LogType, LoggerOptions, Style } from './types';

const REGEX = {
	DATE: /!{date:((.*?)%[\s\S])}/g,
	STYLES: /!{styles.([a-z]+)}/g,
	HEX: /!{hex:(b|f)g:([0-9a-fA-F]{3}|[0-9a-fA-F]{6})}/g,
}

export class OptionsManager {
	protected options: LoggerOptions = {
		logLevel: LogLevel.Fatal,
		outputToFile: false,
		jsonIndent: 2,
		styles: {
			reset: '\x1b[0m',
			bold: '\x1b[1m',
			italic: '\x1b[3m',
			underline: '\x1b[4m',
			strikethrough: '\x1b[9m',
		},
		format: {
			log: "!{date:%Y/%m/%d %H:%M:%S} !{level}!{styles.reset} !{message}",
			path: 'logs/!{date:%Y-%m-%d}.log',
			level: {
				log: { str: '!{hex:fg:a8a8a8}LOG' },
				info: { str: '!{hex:fg:a8a8a8}INFO' },
				success: { str: '!{hex:fg:79ef77}SUCCESS' },
				warning: { str: '!{hex:fg:efe777}WARNING' },
				error: { str: '!{hex:fg:ef8d77}ERROR' },
				fatal: { str: '!{hex:fg:ef8d77}FATAL' },
				debug: { str: '!{hex:fg:a8a8a8}DEBUG' },
			},
		}
	};

	constructor(options: Partial<LoggerOptions> = {}) {
		this.setOptions(options);
	}

	public setOptions(options: Partial<LoggerOptions>) {
		if (options.styles) delete options.styles;
		this.options = merge(this.options, options);
		this.setLevelFormats(this.options.format.level);
	}

	protected formatBase(format: string, message: string, level: LogLevel): string {
		return format
			.replaceAll(REGEX.DATE, (_, date) => strftime(date))
			.replaceAll('!{level}', this.options.format.level[LogLevel[level].toLowerCase() as LogType].ansi!)
			.replaceAll('!{message}', message);
	}

	protected formatColors(format: string, level: LogLevel): string {
		return format
			.replaceAll(REGEX.STYLES, (full, style: Style) => {
				const code = this.options.styles[style];
				if (!code) return full;
				return code;
			})
			.replaceAll(REGEX.HEX, (_, type, hex) => {
				return hexToAnsi(hex, type === 'b');
			})
	}

	protected writeToFile(message: string) {
		const path = this.options.format.path.replaceAll(REGEX.DATE, (_, date) => strftime(date));

		const dir = path.includes('/') ?
			path.split('/').slice(0, -1).join('/'):
			'';

		if (dir) mkdirSync(dir, { recursive: true });
		writeFileSync(path, `${message}\n`, { flag: 'a' });
	}

	public setLogLevel(level: LogLevel) {
		this.options.logLevel = level;
	}

	public setOutputToFile(outputToFile: boolean) {
		this.options.outputToFile = outputToFile;
	}

	public setJsonIndent(indent: number) {
		this.options.jsonIndent = indent;
	}

	// Generic formats
	public setFormats(formats: Partial<LoggerOptions['format']>) {
		delete formats.level;
		this.options.format = merge(this.options.format, formats);
	}

	public setFormat(format: Exclude<keyof LoggerOptions['format'], 'level'>, value: string) {
		this.options.format[format] = value;
	}

	public setLogFormat(value: string) {
		this.setFormat('log', value);
	}

	public setPathFormat(value: string) {
		this.setFormat('path', value);
	}

	// Level formats
	public setLevelFormats(levels: Partial<LoggerOptions['format']['level']>) {
		this.options.format.level = merge(this.options.format.level, levels);
		for (const [level, format] of Object.entries(levels) as [LogType, Format][]) {
			this.setLevelFormat(level, format.str);
		}
	}

	public setLevelFormat(level: LogType, value: string) {
		const _level = logTypeToLogLevel(level);
		this.options.format.level[level] = {
			str: value,
			ansi: this.formatColors(value, _level)
		}
	}

	public setInfoFormat(value: string) {
		this.setLevelFormat('info', value);
	}

	public setSuccessFormat(value: string) {
		this.setLevelFormat('success', value);
	}

	public setWarningFormat(value: string) {
		this.setLevelFormat('warning', value);
	}

	public setErrorFormat(value: string) {
		this.setLevelFormat('error', value);
	}

	public setFatalFormat(value: string) {
		this.setLevelFormat('fatal', value);
	}

	public setDebugFormat(value: string) {
		this.setLevelFormat('debug', value);
	}
}