import { DEFAULT_THEME, highlight, type Theme } from 'cli-highlight';
import { merge } from 'lodash';
import { LogLevel } from './types';
import type {
	ConsolOptions,
	FormatOptions,
	LevelFormat,
	LevelFormatOptions,
	LogArgs,
	LogQueue,
	StringifyOptions,
	StringifyFunc,
	ThemeOptions,
} from './types';
import type { Consol } from '.';

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
			log: { str: '!{hex:fg:#a8a8a8}!' },
			info: { str: '!{hex:fg:#a8a8a8}!' },
			success: { str: '!{hex:fg:#79ef77}!' },
			warning: { str: '!{hex:fg:#efe777}!' },
			error: { str: '!{hex:fg:#ef8d77}!' },
			fatal: { str: '!{hex:fg:#ef8d77}!' },
			debug: { str: '!{hex:fg:#a8a8a8}!' },
		},

		stringify: {
			indent: 2,
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
		if (!this.opts.enabled || this.opts.paused) return false;
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

	public getLevelFormat(level: keyof LevelFormatOptions): LevelFormat {
		return this.opts.levelFormats[level];
	}

	public setLevelFormats(formats: Partial<LevelFormatOptions>): void {
		this.opts.levelFormats = merge(this.opts.levelFormats, formats);
	}

	public setLevelFormat(
		level: keyof LevelFormatOptions,
		format: LevelFormat,
	): void {
		this.opts.levelFormats[level] = format;
	}

	// Stringify
	public stringify(level: LogLevel, ...args: LogArgs): string {
		const res = args
			.flatMap((arg: any) => {
				const argType = typeof arg;
				if (argType === 'string') return arg;
				if (argType === 'number') return (arg as number).toString();
				if (argType === 'bigint') return `${(arg as bigint).toString()}n`;
				if (argType === 'symbol') return (arg as symbol).toString();

				if (argType === 'boolean') {
					return highlight((arg as boolean).toString(), {
						language: 'javascript',
						theme: this.getTheme('javascript'),
					});
				}

				if (argType === 'function') {
					return highlight(arg.toString(), {
						language: 'javascript',
						theme: this.getTheme('javascript'),
					});
				}

				if (arg instanceof Error) {
					return highlight(arg.stack ?? arg.message, {
						language: 'javascript',
						theme: this.getTheme('javascript'),
					});
				}

				if (argType === 'object') {
					// if the toString method is the default Object.toString, assume
					// that it's a plain object and stringify it
					if (arg.toString?.toString().includes('[native code]')) {
						return highlight(
							JSON.stringify(arg, (_, val) => {
								if (typeof val === 'bigint') return `${val.toString()}n`;
								if (typeof val === 'symbol') return val.toString();

								if (typeof val === 'function') {
									return highlight(val.toString(), {
										language: 'javascript',
										theme: this.getTheme('javascript'),
									});
								}

								// if val has .toJSON method, use it
								if (val?.toJSON) return val.toJSON?.();

								// otherwise, return val as is
								return val;
							}, this.opts.stringify.indent),
							{
								language: 'json',
								theme: this.getTheme('json'),
							}
						)
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

	public getStringifyIndent(): number {
		return this.opts.stringify.indent;
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
