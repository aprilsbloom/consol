import { merge } from "lodash";

import { LogLevel } from "./enums";
import type { Format, LoggerOptions, LogType, StringifyFunc, Style } from "./types";
import { Formatter } from "./formatter";
import { ANSI_ESCAPE } from "./utils";
import highlight from "cli-highlight";

export class OptionsManager {
	private options: LoggerOptions = {
		enabled: true,
		paused: false,
		logLevel: LogLevel.Fatal,
		outputToFile: false,
		jsonIndent: 2,

		styles: {
			reset: `${ANSI_ESCAPE}[0m`,
			bold: `${ANSI_ESCAPE}[1m`,
			italic: `${ANSI_ESCAPE}[3m`,
			underline: `${ANSI_ESCAPE}[4m`,
			strikethrough: `${ANSI_ESCAPE}[9m`,
		},

		format: {
			log: "!{date:%Y/%m/%d %H:%M:%S}! !{level}! !{message}!",
			path: 'logs/!{date:%Y-%m-%d}!.log',
			level: {
				log: { str: '!{hex:fg:#a8a8a8}!LOG' },
				info: { str: '!{hex:fg:#a8a8a8}!INFO' },
				success: { str: '!{hex:fg:#79ef77}!SUCCESS' },
				warning: { str: '!{hex:fg:#efe777}!WARNING' },
				error: { str: '!{hex:fg:#ef8d77}!ERROR' },
				fatal: { str: '!{hex:fg:#ef8d77}!FATAL' },
				debug: { str: '!{hex:fg:#a8a8a8}!DEBUG' },
			},
		}
	};

	constructor(options: Partial<LoggerOptions> = {}) {
		this.set(options);
	}

	// Options utilities
	public set(options: Partial<LoggerOptions>): void {
		this.options = merge(this.options, options);
		this.setLevelFormats(this.options.format.level);
	}

	public setKey(key: string, value: any): void {
		const keys = key.split('.');
		let result: any = this.options;

		for (let i = 0; i < keys.length - 1; i++) {
			if (!result[keys[i]] || typeof result[keys[i]] !== 'object') {
				result[keys[i]] = {};
			}

			result = result[keys[i]];
		}

		result[keys[keys.length - 1]] = value;
	}

	public get(): LoggerOptions {
		return this.options;
	}

	public getKey(key: string): any {
		const keys = key.split('.');
		if (keys.length === 1) return (this.options as any)[key];

		let result = this.options;
		for (const k of keys) {
			if (!result || typeof result !== 'object') return undefined;
			result = (result as any)[k];
		}

		return result;
	}

	// Format utilities
	public stringify(...args: any[]): string {
		return args
			.map(item => {
				if (typeof item === 'string') return item;

				// highlihgt functions if passed in
				if (typeof item === 'function') {
					const func = item.toString();
					try {
						return highlight(func, { language: 'javascript' });
					} catch {
						return func;
					}
				}

				if (typeof item === 'object') {
					// if there isn't a toString method, we can assume it's a native object
					if (item.toString?.toString().includes('[native code]')) {
						const val = JSON.stringify(
							item,
							(_, value) => {
								if (typeof value === 'function') return value.toString();
								if (typeof value === 'bigint') return `${value.toString()}n`;
								return value;
							},
							this.options.jsonIndent
						);

						try {
							return highlight(val, { language: 'json' });
						} catch {
							return val;
						}
					}

					// otherwise just call it manually & assume it's a custom object
					return item.toString();
				}

				return item;
			})
			.join(' ')
			.trim();
	}

	public setStringifyFunc(fn: StringifyFunc) {
		this.stringify = fn;
		this.stringify = this.stringify.bind(this);
	}

	// Base
	public setEnabled(enabled: boolean): void {
		this.options.enabled = enabled;
	}

	public isEnabled(): boolean {
		return this.options.enabled;
	}

	public setPaused(paused: boolean): void {
		this.options.paused = paused;
	}

	public isPaused(): boolean {
		return this.options.paused;
	}

	public setLogLevel(level: LogLevel): void {
		this.options.logLevel = level;
	}

	public getLogLevel(): LogLevel {
		return this.options.logLevel;
	}

	public shouldLog(level?: LogLevel): boolean {
		if (level !== undefined) {
			return this.options.enabled && level <= this.options.logLevel;
		}

		return this.options.enabled;
	}

	public setOutputToFile(outputToFile: boolean): void {
		this.options.outputToFile = outputToFile;
	}

	public shouldOutputToFile(): boolean {
		return this.options.outputToFile;
	}

	public setJsonIndent(indent: number): void {
		this.options.jsonIndent = indent;
	}

	public getJsonIndent(): number {
		return this.options.jsonIndent;
	}

	// Styles
	public getStyles(): LoggerOptions['styles'] {
		return this.options.styles;
	}

	public getStyle(style: Style): string {
		return this.options.styles[style];
	}

	// Base formats
	public setFormats(formats: Partial<LoggerOptions['format']>) {
		this.options.format = merge(this.options.format, formats);
	}

	public getFormats(): LoggerOptions['format'] {
		return this.options.format;
	}

	public setFormat(format: Exclude<keyof LoggerOptions['format'], 'level'>, value: string) {
		this.options.format[format] = value;
	}

	public getFormat(format: Exclude<keyof LoggerOptions['format'], 'level'>): string {
		return this.options.format[format] + this.options.styles.reset;
	}

	public setBaseLogFormat(value: string) {
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

	public getLevelFormats(): LoggerOptions['format']['level'] {
		return this.options.format.level;
	}

	public setLevelFormat(level: LogType, value: string) {
		const ansiStr = new Formatter(this, value)
			.formatHex()
			.formatStyles()
			.formatCode()
			.result();

		this.options.format.level[level] = {
			str: value,
			ansi: ansiStr
		}
	}

	public getLevelFormat(level: LogType): Format {
		return this.options.format.level[level];
	}

	public setLogFormat(value: string) {
		this.setLevelFormat('log', value);
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