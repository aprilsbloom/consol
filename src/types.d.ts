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
		ansi: Record<LogType, string>;
	};
	strings: Partial<Record<LogType, string>>;
}