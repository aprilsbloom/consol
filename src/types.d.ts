import type { LogLevel } from "./enums";

export type LogType = keyof typeof LogLevel extends infer T ? Lowercase<T & string> : never;
export type Style = 'reset' | 'bold' | 'italic' | 'underline' | 'strikethrough';

export interface LoggerOptions {
	logLevel: LogLevel;
	outputToFile: boolean;
	jsonIndent: number;
	styles: Record<Style, string>;
	format: {
		log: string;
		path: string;
		level: Record<LogType, Format>;
	}
}

export interface Format {
	str: string;
	ansi?: string;
}