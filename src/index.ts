import strftime from 'strftime';
import {merge} from 'lodash';
import type { LoggerOptions } from './types';

export class Logger {
	private options: LoggerOptions = {
		timeFormat: '%Y/%m/%d %H:%M:%S',
		colors: {
			success: '',
			warning: '',
			error: '',
			info: '',
			debug: '',
		},
	}

	constructor(options: Partial<LoggerOptions> = {}) {
		this.options = merge(this.options, options);
	}

	private fetchDate(date: Date = new Date(), format: string = '') {
		if (!format) format = this.options.timeFormat;
		return strftime(format, date);
	}

	public setOptions(options: Partial<LoggerOptions>) {
		this.options = merge(this.options, options);
	}
}

const logger = new Logger();