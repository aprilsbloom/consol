import strftime from 'strftime';
import { OptionsManager } from './optionsManager';
import { LogLevel } from './enums';
import type { LoggerOptions, LogType } from './types.d.ts';

export class Logger extends OptionsManager {
	constructor(options: Partial<LoggerOptions> = {}) {
		super(options);
	}

	private fetchDate(date: Date = new Date(), format: string = '') {
		if (!format) format = this.options.formats.time;
		return strftime(format, date);
	}

	private log(level: LogLevel, message: string, ...args: any[]) {
		if (level > this.options.logLevel) return;

		const fmtMessage = this.options.formats.log
			.replaceAll('{date}', this.fetchDate())
			.replaceAll('{level}', this.options.strings[LogLevel[level].toLowerCase() as LogType]!);

		const messageStr = args.length ?
			// biome-ignore lint/style/useTemplate: template literals make it harder to read
		  message + " " + args.map(item => {
				if (typeof item === 'string') return item;
				if (typeof item === 'object') return JSON.stringify(item, null, 2);
				return item;
			})
			.join(' ') :
			message;

		console.log(fmtMessage.replaceAll('{message}', messageStr));
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
logger.success('meow mrrp meow', {
	meow: 'mrrp',
});