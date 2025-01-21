import { LogLevel } from './enums';
import type { Theme } from 'cli-highlight';
import { merge } from 'lodash';

export interface ConsolOptions {
	enabled: boolean;
	paused: boolean;
	level: LogLevel;
	stringify: StringifyOptions;
}

export interface StringifyOptions {
	indent: number;
	themes: Record<string, Theme>;
}

export class NewOptions {
	public opts: ConsolOptions = {
		enabled: true,
		paused: false,
		level: LogLevel.Info,

		stringify: {
			indent: 2,
			themes: {},
		},
	};

	constructor(opts: Partial<ConsolOptions>) {
		this.opts = merge(this.opts, opts);
	}

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

	public setStringifyOptions(options: Partial<StringifyOptions>): void {
		this.opts.stringify = merge(this.opts.stringify, options);
	}

	public getStringifyOptions(): StringifyOptions {
		return this.opts.stringify;
	}

	public setIndent(indent: number): void {
		this.opts.stringify.indent = indent;
	}

	public getIndent(): number {
		return this.opts.stringify.indent;
	}

	public getThemes(): Record<string, Theme> {
		return this.opts.stringify.themes;
	}

	public getTheme(name: string): Theme | undefined {
		return this.opts.stringify.themes[name];
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
