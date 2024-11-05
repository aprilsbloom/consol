import type { LogLevel } from "./enums";

export type LogType = 'success' | 'warning' | 'error' | 'fatal' | 'info' | 'debug';

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