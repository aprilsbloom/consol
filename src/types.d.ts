import type { LogLevel } from "./enums";

export type LogType = 'info' | 'success' | 'warning' | 'error' | 'fatal' | 'debug';

export interface LoggerOptions {
	logLevel: LogLevel;
	formats: {
		log: string;
		time: string;
	},
	colors: {
		str: Record<LogType, string>;
		ansi: Partial<Record<LogType, string>> & { reset: string; };
	};
	strings: Partial<Record<LogType, string>>;
}