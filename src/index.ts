import strftime from 'strftime';
import { OptionsManager } from './optionsManager';
import { LogLevel } from './types';
import type { LoggerOptions } from './types';

export class Logger extends OptionsManager {
	constructor(options: Partial<LoggerOptions> = {}) {
		super(options);
	}

	private fetchDate(date: Date = new Date(), format: string = '') {
		if (!format) format = this.options.formats.time;
		return strftime(format, date);
	}

	private log(level: LogLevel, message: string, ...args: any[]) {
		if (level < this.options.logLevel) return;

		const fmtMessage = this.options.formats.log
			.replaceAll('%date', this.fetchDate())
			.replaceAll('%level', LogLevel[level]);
	}
}

const logger = new Logger();
