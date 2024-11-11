import type { LogLevel } from "./enums";

export type LogType = 'log' | 'info' | 'success' | 'warning' | 'error' | 'fatal' | 'debug';
export type Style = 'reset' | 'bold' | 'italic' | 'underline' | 'strikethrough';

export interface LoggerOptions {
	logLevel: LogLevel;
	outputToFile: boolean;
	jsonIndent: number;
	styles: Record<Style, string>;
	format: {
		log: string;
		date: string;
		path: string;
		level: Record<LogType, Format>;
	}
}

export interface Format {
	str: string;
	ansi?: string;
}