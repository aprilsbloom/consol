import type { LogLevel } from "./enums";

export type LogType = 'info' | 'success' | 'warning' | 'error' | 'fatal' | 'debug';

export interface LoggerOptions {
	logLevel: LogLevel;
	formats: {
		log: string;
		date: string;
		altDate: string;
	},
	colors: Record<string, Color> & { reset: string };
	strings: Record<LogType, string>;
}

export interface Color {
	hex: string,
	ansi?: string,
}