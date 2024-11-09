import strftime from 'strftime';
import { OptionsManager } from './optionsManager';
import { LogLevel } from './enums';
import type { LoggerOptions, LogType, Style } from './types.d.ts';
import { hexToAnsi } from './utils.ts';

export class Logger extends OptionsManager {
	constructor(options: Partial<LoggerOptions> = {}) {
		super(options);
	}

	private fetchDate(format: string = '', date: Date = new Date()) {
		if (!format) format = this.options.formats.date;
		return strftime(format, date);
	}

	private formatBase(format: string, message: string, level: LogLevel): string {
		return format
			.replaceAll('!{date}', this.fetchDate())
			.replaceAll('!{altDate}', this.fetchDate(this.options.formats.altDate))
			.replaceAll('!{level}', this.options.strings[LogLevel[level].toLowerCase() as LogType]!)
			.replaceAll('!{message}', message);
	}

	private formatColors(message: string, level: LogLevel): string {
		return message
			.replaceAll(/!{styles.([a-z]+)}/g, (full, style: Style) => {
				const code = this.options.styles[style];
				if (!code) return full;
				return code;
			})
			.replaceAll(/!{hex:(b|f)g:([0-9a-fA-F]{3}|[0-9a-fA-F]{6})}/g, (_, type, hex) => {
				return hexToAnsi(hex, type === 'b');
			})
			.replaceAll('!{colors.level}', this.options.colors[LogLevel[level].toLowerCase() as LogType].ansi!)
			.replaceAll(/!{colors.([a-z]+)}/g, (full, color: LogType) => {
				const code = this.options.colors[color].ansi;
				if (!code) return full;
				return code
			})
	}

	private log(level: LogLevel, message: string, ...args: any[]) {
		if (level > this.options.logLevel) return;

		const messageStr = (args.length ?
			// biome-ignore lint/style/useTemplate: template literals make the code harder to read here lol
		  message + " " + args.map(item => {
				if (typeof item === 'string') return item;
				if (typeof item === 'object') return JSON.stringify(item, null, 2);
				if (item?.toString) return item.toString();
				return item;
			}).join(' ') :
			message)
			.replaceAll("!{", "!​{"); // zero-width space to prevent template literals in messages

		let fmtdMessage = this.formatBase(this.options.formats.log, messageStr, level); // add date, log level & message
		fmtdMessage = this.formatColors(fmtdMessage, level); // add colors

		console.log(this.options.styles.reset + fmtdMessage);
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
logger.info('!{hex:000000}meow mrrp meow');
logger.success('meow mrrp meow');
logger.warning('meow mrrp meow');
logger.debug('meow mrrp meow');
logger.error('meow mrrp meow');
logger.fatal('meow mrrp meow');