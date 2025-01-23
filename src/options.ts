import type { Theme } from "cli-highlight";
import { merge } from "lodash";
import { LogLevel } from "./types";
import type { ConsolOptions, FormatOptions, LevelFormat, LevelFormatOptions, StringifyOptions, ThemeOptions } from "./types";


export class Options {
	public opts: ConsolOptions = {
		enabled: true,
		paused: false,
		level: LogLevel.Fatal,

		formats: {
			log: "!{date:%Y/%m/%d %H:%M:%S}! !{level}! !{message}!",
			path: "logs/!{date:%Y-%m-%d}!",
		},

		levelFormats: {
			log: { str: "!{hex:fg:#a8a8a8}!" },
			info: { str: "!{hex:fg:#a8a8a8}!" },
			success: { str: "!{hex:fg:#79ef77}!" },
			warning: { str: "!{hex:fg:#efe777}!" },
			error: { str: "!{hex:fg:#ef8d77}!" },
			fatal: { str: "!{hex:fg:#ef8d77}!" },
			debug: { str: "!{hex:fg:#a8a8a8}!" }
		},

		stringify: {
			indent: 2,
			themes: {},
		},
	};

	constructor(opts: Partial<ConsolOptions> = {}) {
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

	public pause(): void {
		this.opts.paused = true;
	}

	public resume(): void {
		this.opts.paused = false;
	}

	public canLog(): boolean {
		return this.opts.enabled && !this.opts.paused;
	}

	public setLogLevel(level: LogLevel): void {
		this.opts.level = level;
	}

	public getLogLevel(): LogLevel {
		return this.opts.level;
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

	public setLevelFormat(level: keyof LevelFormatOptions, format: LevelFormat): void {
		this.opts.levelFormats[level] = format;
	}

	// Stringify
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
		return this.opts.stringify.themes[name];
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