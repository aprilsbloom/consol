export type LogType = 'success' | 'warning' | 'error' | 'fatal' | 'info' | 'debug' | 'value';

export interface LoggerOptions {
	logLevel: LogLevel;
	formats: {
		log: string;
		time: string;
	},
	colors: {
		str: Record<LogType, string>;
		ansi: Record<LogType, string>;
	};
	strings: Partial<Record<LogType, string>>;
}

export enum LogLevel {
	INFO,
	SUCCESS,
	WARNING,
	ERROR,
	FATAL,
	DEBUG,
}