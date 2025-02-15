import type { Theme } from 'cli-highlight';
import { DEFAULT_THEME, highlight } from 'cli-highlight';
import { merge } from 'lodash';
import type { Consol } from '.';
import type {
	ConsolOptions,
	FormatOptions,
	LevelFormatOptions,
	LogArgs,
	LogQueue,
	StringifyOptions,
	ThemeOptions,
} from './types';
import { LogLevel, logLevelToLogType } from './types';

export class Options {
	private consol: Consol;

	public opts: ConsolOptions = {
		enabled: true,
		paused: false,
		level: LogLevel.Fatal,

		formats: {
			log: '!{date:%Y/%m/%d %H:%M:%S}! !{level}! !{message}!',
			path: 'logs/!{date:%Y-%m-%d}!',
		},

		levelFormats: {
			log: '!{hex:fg:#a8a8a8}!',
			info: '!{hex:fg:#a8a8a8}!',
			success: '!{hex:fg:#79ef77}!',
			warning: '!{hex:fg:#efe777}!',
			error: '!{hex:fg:#ef8d77}!',
			fatal: '!{hex:fg:#ef8d77}!',
			debug: '!{hex:fg:#a8a8a8}!',
		},

		stringify: {
			indent: 2,
			shouldStringifyFunctions: true,
			themes: {},
		},
	};

	constructor(consol: Consol, opts: Partial<ConsolOptions> = {}) {
		this.consol = consol;
		this.set(opts);
	}

	public set(opts: Partial<ConsolOptions>): void {
		this.opts = merge(this.opts, opts);
	}

	public get(): ConsolOptions {
		return this.opts;
	}

	// General
	public enable(): void {
		this.opts.enabled = true;
	}

	public disable(): void {
		this.opts.enabled = false;
	}

	public isEnabled(): boolean {
		return this.opts.enabled;
	}

	public pause(): void {
		this.opts.paused = true;
	}

	public resume(): void {
		this.opts.paused = false;
		this.flushLogQueue();
	}

	public isPaused(): boolean {
		return this.opts.paused;
	}

	public canLog(level?: LogLevel): boolean {
		if (!this.opts.enabled) return false;
		return level ? level <= this.opts.level : true;
	}

	public setLogLevel(level: LogLevel): void {
		this.opts.level = level;
	}

	public getLogLevel(): LogLevel {
		return this.opts.level;
	}

	// Log queue
	private logQueue: LogQueue = [];
	public addLogToQueue(level: LogLevel, args: LogArgs): void {
		this.logQueue.push([level, args]);
	}

	public getLogQueue(): LogQueue {
		return this.logQueue;
	}

	public flushLogQueue(): void {
		for (const [level, args] of this.logQueue) {
			this.consol.customLog(level, args);
		}

		this.clearLogQueue();
	}

	public clearLogQueue(): void {
		this.logQueue = [];
	}

	// Formats
	public getFormats(): FormatOptions {
		return this.opts.formats;
	}

	public getFormat(type: keyof FormatOptions): string {
		return this.opts.formats[type];
	}

	public setFormats(formats: Partial<FormatOptions>): void {
		this.opts.formats = merge(this.opts.formats, formats);
	}

	public setFormat(type: keyof FormatOptions, format: string): void {
		this.opts.formats[type] = format;
	}

	// Level formats
	public getLevelFormats(): LevelFormatOptions {
		return this.opts.levelFormats;
	}

	public getLevelFormat(level: LogLevel | keyof LevelFormatOptions): string {
		if (typeof level === 'number') {
			if (level === LogLevel.None) return '';
			level = logLevelToLogType(level) as keyof LevelFormatOptions;
		}

		return this.opts.levelFormats[level];
	}

	public setLevelFormats(formats: Partial<LevelFormatOptions>): void {
		this.opts.levelFormats = merge(this.opts.levelFormats, formats);
	}

	public setLevelFormat(level: keyof LevelFormatOptions, format: string): void {
		this.opts.levelFormats[level] = format;
	}

	// Stringify
	public stringify(...args: LogArgs): string {
		const res = args
			.flatMap((arg: any) => {
				const type = typeof arg;
				if (type === 'string') return arg;
				if (type === 'number') return (arg as number).toString();
				if (type === 'bigint') return `${(arg as bigint).toString()}n`;
				if (type === 'symbol') return (arg as symbol).toString();

				if (type === 'boolean') {
					return highlight((arg as boolean).toString(), {
						language: 'javascript',
						theme: this.getTheme('javascript'),
					});
				}

				if (type === 'function') {
					return this.opts.stringify.shouldStringifyFunctions
						? highlight(arg.toString(), {
							language: 'javascript',
							theme: this.getTheme('javascript'),
						})
						: '[function]';
				}

				if (arg instanceof Error) {
					return highlight(arg.stack ?? arg.message, {
						language: 'javascript',
						theme: this.getTheme('javascript'),
					});
				}

				if (type === 'object') {
					// if the toString method is the default Object.toString, assume
					// that it's a plain object and stringify it
					if (arg.toString?.toString().includes('[native code]')) {
						return highlight(
							JSON.stringify(
								arg,
								(key, val) => {
									const type = typeof val;

									// if val has .toJSON method, use it
									if (key === 'toJSON' || key === 'toJson') {
										return val();
									}

									if (type === 'bigint') return `${val.toString()}n`;
									if (type === 'symbol') return val.toString();
									if (type === 'function')
										return this.opts.stringify.shouldStringifyFunctions
											? val.toString()
											: '[function]';

									// otherwise, return val as is
									return val;
								},
								this.opts.stringify.indent,
							),
							{
								language: 'json',
								theme: this.getTheme('json'),
							},
						);
					}

					// otherwise, use the custom toString method
					return arg.toString();
				}

				return arg.toString();
			})
			.join(' ');

		return res;
	}

	public getStringifyOptions(): StringifyOptions {
		return this.opts.stringify;
	}

	public setStringifyOptions(options: Partial<StringifyOptions>): void {
		this.opts.stringify = merge(this.opts.stringify, options);
	}

	public setStringifyIndent(indent: number): void {
		this.opts.stringify.indent = indent;
	}

	public setShouldStringifyFunctions(val: boolean) {
		this.opts.stringify.shouldStringifyFunctions = val;
	}

	public getStringifyIndent(): number {
		return this.opts.stringify.indent;
	}

	public shouldStringifyFunctions(): boolean {
		return this.opts.stringify.shouldStringifyFunctions;
	}

	public getThemes(): ThemeOptions {
		return this.opts.stringify.themes;
	}

	public getTheme(name: string): Theme | undefined {
		return this.opts.stringify.themes[name] ?? DEFAULT_THEME;
	}

	public setThemes(themes: ThemeOptions): void {
		this.opts.stringify.themes = merge(this.opts.stringify.themes, themes);
	}

	public setTheme(name: string, theme: Theme): void {
		this.opts.stringify.themes[name] = theme;
	}

	public deleteTheme(name: string): void {
		delete this.opts.stringify.themes[name];
	}

	public clearThemes(): void {
		this.opts.stringify.themes = {};
	}
}
