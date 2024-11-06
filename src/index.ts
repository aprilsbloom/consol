import strftime from 'strftime';
import { OptionsManager } from './optionsManager';
import { LogLevel } from './enums';
import type { LoggerOptions, LogType } from './types.d.ts';

export class Logger extends OptionsManager {
	constructor(options: Partial<LoggerOptions> = {}) {
		super(options);
	}

	private fetchDate(format: string = '', date: Date = new Date()) {
		if (!format) format = this.options.formats.date;
		return strftime(format, date);
	}

	private formatBase(message: string, level: LogLevel): string {
		return this.options.formats.log
			.replaceAll('{date}', this.fetchDate())
			.replaceAll('{altDate}', this.fetchDate(this.options.formats.altDate))
			.replaceAll('{level}', this.options.strings[LogLevel[level].toLowerCase() as LogType]!)
			.replaceAll('{message}', message);
	}

	private formatColors(message: string, level: LogLevel): string {
		return message
			.replaceAll('{colors.level}', this.options.colors.ansi[LogLevel[level].toLowerCase() as LogType]!)
			.replaceAll('{colors.info}', this.options.colors.ansi.info!)
			.replaceAll('{colors.success}', this.options.colors.ansi.success!)
			.replaceAll('{colors.warning}', this.options.colors.ansi.warning!)
			.replaceAll('{colors.error}', this.options.colors.ansi.error!)
			.replaceAll('{colors.fatal}', this.options.colors.ansi.fatal!)
			.replaceAll('{colors.debug}', this.options.colors.ansi.debug!)
			.replaceAll('{colors.reset}', this.options.colors.ansi.reset);
	}

	private log(level: LogLevel, message: string, ...args: any[]) {
		if (level > this.options.logLevel) return;

		const messageStr = args.length ?
			// biome-ignore lint/style/useTemplate: template literals make the code harder to read here lol
		  message + " " + args.map(item => {
				if (typeof item === 'string') return item;
				if (typeof item === 'object') return JSON.stringify(item, null, 2);
				if (item?.toString) return item.toString();
				return item;
			}).join(' ') :
			message;

		let fmtdMessage = this.formatBase(messageStr, level); // add date, log level & message
		fmtdMessage = this.formatColors(fmtdMessage, level); // add colors

		console.log(fmtdMessage);
	}

	public info(message: string, ...args: any[]) {
		this.log(LogLevel.Info, message, ...args);
	}

	public success(message: string, ...args: any[]) {
		this.log(LogLevel.Success, message, ...args);
	}

	public warning(message: string, ...args: any[]) {
		this.log(LogLevel.Warning, message, ...args);
	}

	public error(message: string, ...args: any[]) {
		this.log(LogLevel.Error, message, ...args);
	}

	public fatal(message: string, ...args: any[]) {
		this.log(LogLevel.Fatal, message, ...args);
		process.exit(1);
	}

	public debug(message: string, ...args: any[]) {
		this.log(LogLevel.Debug, message, ...args);
	}
}

const logger = new Logger();
logger.info('meow mrrp meow');
logger.success('meow mrrp meow');
logger.warning('meow mrrp meow');
logger.debug('meow mrrp meow');
logger.error('meow mrrp meow');
logger.fatal('meow mrrp meow');