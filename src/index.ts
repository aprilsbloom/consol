import { mkdirSync, writeFileSync } from 'node:fs';
import { LogLevel } from "./enums";
import { Formatter } from "./formatter";
import { OptionsManager } from "./optionsManager";
import type { LoggerOptions, StringifyFunc } from "./types";

export class Consol {
	public options: OptionsManager;

	constructor(options: Partial<LoggerOptions> = {}) {
		this.options = new OptionsManager(options);
	}

	public stringify(...args: any[]): string {
		return args
			.map(item => {
				if (typeof item === 'string') return item;
				if (typeof item === 'object') {
					return JSON.stringify(
						item,
						(_, value) => {
							if (typeof value === 'function') return value.toString();
							return value;
						},
						this.options.getJsonIndent()
					);
				}
				if (item?.toString) return item.toString();
				return item;
			})
			.join(' ')
			.trim();
	}

	public setStringifyFunc(fn: StringifyFunc) {
		this.stringify = fn;
		this.stringify = this.stringify.bind(this);
	}

	private writeToFile(level: LogLevel, msg: string) {
		const path = new Formatter(this.options, this.options.getFormat('path'))
			.formatDate()
			.formatLevelStr(level)
			.removeAnsi()
			.removeTemplates()
			.result();

		const dir = path.includes('/') ?
			path.split('/').slice(0, -1).join('/').trim():
			'';

		if (dir) mkdirSync(dir, { recursive: true });
		writeFileSync(path, `${msg}\n`, { flag: 'a' });
	}

	private _log(level: LogLevel, args: any[]) {
		if (!this.options.shouldLog(level)) return;

		const msg = this.stringify(...args);
		const fmt = new Formatter(this.options, this.options.getFormat('log'));

		// only do date & msg template for starters
		fmt
			.formatDate()
			.formatMessage(msg)

		// if writing to a file, we want to strip ansi codes and
		// any other template string (excl. level)
		if (this.options.shouldOutputToFile()) {
			const tmp = fmt
				.clone()
				.formatLevelStr(level)
				.removeAnsi()
				.removeTemplates()
				.result();

			this.writeToFile(level, tmp);
		}

		// now we can add the actual level content,
		// styles & hex templates
		fmt
			.formatLevelAnsi(level)
			.formatStyles()
			.formatHex()
			.formatCode();

		console.log(this.options.getStyle('reset') + fmt.result());
	}

	public log(...args: any[]) {
		this._log(LogLevel.Log, args);
	}

	public info(...args: any[]) {
		this._log(LogLevel.Info, args);
	}

	public success(...args: any[]) {
		this._log(LogLevel.Success, args);
	}

	public warning(...args: any[]) {
		this._log(LogLevel.Warning, args);
	}

	public error(...args: any[]) {
		this._log(LogLevel.Error, args);
	}

	public fatal(...args: any[]) {
		this._log(LogLevel.Fatal, args);
		process.exit(1);
	}

	public debug(...args: any[]) {
		this._log(LogLevel.Debug, args);
	}
}

export const consol = new Consol();
consol.info('meow mrrp meow');
consol.success('meow mrrp meow !{code:js:console.log("hello world")}!');
consol.warning('meow mrrp meow');
consol.debug('meow mrrp meow');
consol.error('meow mrrp meow');
consol.fatal('meow mrrp meow');