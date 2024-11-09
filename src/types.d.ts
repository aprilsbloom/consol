import type { LogLevel } from "./enums";

export type LogType = 'info' | 'success' | 'warning' | 'error' | 'fatal' | 'debug';
export type Style = 'reset' | 'bold' | 'italic' | 'underline' | 'strikethrough';

export interface LoggerOptions {
	logLevel: LogLevel;
	formats: {
		log: string;
		date: string;
		altDate: string;
	},
	colors: Record<LogType, Color>;
	styles: Record<Style, string>;
	strings: Record<LogType, string>;
}

export interface Color {
	hex: string,
	ansi?: string,
}