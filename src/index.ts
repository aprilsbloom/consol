import strftime from 'strftime';
import { OptionsManager } from './optionsManager';
import { LogLevel } from './enums';
import type { LoggerOptions, LogType } from './types.d.ts';

export class Logger extends OptionsManager {
	constructor(options: Partial<LoggerOptions> = {}) {
		super(options);
	}

	private fetchDate(date: Date = new Date(), format: string = '') {
		if (!format) format = this.options.formats.date;
		return strftime(format, date);
	}

	private log(level: LogLevel, message: string, ...args: any[]) {
		if (level > this.options.logLevel) return;

		const levelLowercase = LogLevel[level].toLowerCase() as LogType;
		const messageStr = args.length ?
			// biome-ignore lint/style/useTemplate: template literals make the code harder to read here lol
		  message + " " + args.map(item => {
				if (typeof item === 'string') return item;
				if (typeof item === 'object') return JSON.stringify(item, null, 2);
				if (item?.toString) return item.toString();
				return item;
			}).join(' ') :
			message;

		// add date, log level & message
		let fmtdMessage = this.options.formats.log
			.replaceAll('{date}', this.fetchDate())
			.replaceAll('{level}', this.options.strings[levelLowercase]!)
			.replaceAll('{message}', messageStr);

		// add colors
		fmtdMessage = fmtdMessage
			.replaceAll('{colors.level}', this.options.colors.ansi[levelLowercase]!)
			.replaceAll('{colors.info}', this.options.colors.ansi.info!)
			.replaceAll('{colors.success}', this.options.colors.ansi.success!)
			.replaceAll('{colors.warning}', this.options.colors.ansi.warning!)
			.replaceAll('{colors.error}', this.options.colors.ansi.error!)
			.replaceAll('{colors.fatal}', this.options.colors.ansi.fatal!)
			.replaceAll('{colors.debug}', this.options.colors.ansi.debug!)
			.replaceAll('{colors.reset}', this.options.colors.ansi.reset);

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