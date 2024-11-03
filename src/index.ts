import strftime from 'strftime';
import { OptionsManager } from './optionsManager';
import type { LoggerOptions } from './types';


export class Logger extends OptionsManager {
	constructor(options: Partial<LoggerOptions> = {}) {
		super(options);
	}

	private fetchDate(date: Date = new Date(), format: string = '') {
		if (!format) format = this.options.timeFormat;
		return strftime(format, date);
	}
}


const logger = new Logger();