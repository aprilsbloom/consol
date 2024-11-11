

import { LogLevel } from './enums';
import { OptionsManager } from './optionsManager';
import type { LoggerOptions } from './types.d.ts';

export class Logger extends OptionsManager {
	constructor(options: Partial<LoggerOptions> = {}) {
		super(options);
	}

	private _log(level: LogLevel, message: string, ...args: any[]) {
		if (level > this.options.logLevel) return;

		const messageStr = (
			args.length ?
				// biome-ignore lint/style/useTemplate: template literals make the code harder to read here lol
				message + " " + args.map(item => {
					if (typeof item === 'string') return item;
					if (typeof item === 'object') {
						return JSON.stringify(
							item,
							(_, value) => {
								if (typeof value === 'function') return value.toString();
								return value;
							},
							this.options.jsonIndent
						);
					}
					if (item?.toString) return item.toString();
					return item;
				}).join(' ') :
				message
			)
			// .replaceAll("!{", "!​{"); // zero-width space to prevent template literals in messages

		let fmtdMessage = this.formatBase(this.options.format.log, messageStr, level);
		if (this.options.outputToFile) this.writeToFile(fmtdMessage);

		fmtdMessage = this.formatColors(fmtdMessage, level);

		console.log(this.options.styles.reset + fmtdMessage);
	}

	public log(message: string, ...args: any[]) {
		this._log(LogLevel.Log, message, ...args);
	}

	public info(message: string, ...args: any[]) {
		this._log(LogLevel.Info, message, ...args);
	}

	public success(message: string, ...args: any[]) {
		this._log(LogLevel.Success, message, ...args);
	}

	public warning(message: string, ...args: any[]) {
		this._log(LogLevel.Warning, message, ...args);
	}

	public error(message: string, ...args: any[]) {
		this._log(LogLevel.Error, message, ...args);
	}

	public fatal(message: string, ...args: any[]) {
		this._log(LogLevel.Fatal, message, ...args);
		process.exit(1);
	}

	public debug(message: string, ...args: any[]) {
		this._log(LogLevel.Debug, message, ...args);
	}
}

const logger = new Logger();
logger.setOutputToFile(true);
logger.info('meow mrrp meow');
logger.success('meow mrrp meow');
logger.warning('meow mrrp meow');
logger.debug('meow mrrp meow');
logger.error('meow mrrp meow');
logger.fatal('meow mrrp meow');