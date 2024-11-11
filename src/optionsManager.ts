import { merge } from 'lodash';
import strftime from 'strftime';
import { mkdirSync, writeFileSync } from 'node:fs';

import { LogLevel, logTypeToLogLevel } from './enums';
import { hexToAnsi } from './utils';
import type { Format, LogType, LoggerOptions, Style } from './types';

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
			log: "!{date} !{level}!{styles.reset} !{message}",
			date: '%Y/%m/%d %H:%M:%S',
			path: 'logs/%Y-%m-%d.log',
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
		this.options = merge(this.options, options);
		this.setLevelFormats(this.options.format.level);
	}

	protected formatBase(format: string, message: string, level: LogLevel): string {
		return format
			.replaceAll('!{date}', this.fetchDate())
			.replaceAll('!{level}', this.options.format.level[LogLevel[level].toLowerCase() as LogType].ansi!)
			.replaceAll('!{message}', message);
	}

	protected fetchDate(format: string = '', date: Date = new Date()) {
		if (!format) format = this.options.format.date;
		return strftime(format, date);
	}

	protected formatColors(format: string, level: LogLevel): string {
		return format
			.replaceAll(/!{styles.([a-z]+)}/g, (full, style: Style) => {
				const code = this.options.styles[style];
				if (!code) return full;
				return code;
			})
			.replaceAll(/!{hex:(b|f)g:([0-9a-fA-F]{3}|[0-9a-fA-F]{6})}/g, (_, type, hex) => {
				return hexToAnsi(hex, type === 'b');
			})
			// .replaceAll('!{colors.level}', this.options.colors[LogLevel[level].toLowerCase() as LogType].ansi!)
			// .replaceAll(/!{colors.([a-z]+)}/g, (full, color: LogType) => {
			// 	const code = this.options.colors[color]?.ansi;
			// 	if (!code) return full;
			// 	return code
			// })
	}

	protected writeToFile(message: string) {
		const path = this.fetchDate(this.options.format.path);
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

	// Styles
	public setStyles(styles: Partial<LoggerOptions['styles']>) {
		this.options.styles = merge(this.options.styles, styles);
	}

	public setStyle(style: keyof LoggerOptions['styles'], value: string) {
		this.options.styles[style] = value;
	}

	public setResetStyle(value: string) {
		this.setStyle('reset', value);
	}

	public setBoldStyle(value: string) {
		this.setStyle('bold', value);
	}

	public setItalicStyle(value: string) {
		this.setStyle('italic', value);
	}

	public setUnderlineStyle(value: string) {
		this.setStyle('underline', value);
	}

	public setStrikethroughStyle(value: string) {
		this.setStyle('strikethrough', value);
	}

	// Generic formats
	public setFormats(formats: Partial<LoggerOptions['format']>) {
		delete formats.level;
		this.options.format = merge(this.options.format, formats);
	}

	public setFormat(format: Exclude<keyof LoggerOptions['format'], 'level'>, value: string) {
		this.options.format[format] = value;
	}

	public setDateFormat(value: string) {
		this.setFormat('date', value);
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
			this.setLevelFormat(level as LogType, format.str);
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