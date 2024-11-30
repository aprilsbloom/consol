import type { Theme } from "cli-highlight";

import type { LogLevel } from "./enums";

export type StringifyFunc = (...args: any[]) => string;
export type LogType = keyof typeof LogLevel extends infer T ? Lowercase<T & string> : never;
export type Style = 'reset' | 'bold' | 'italic' | 'underline' | 'strikethrough';

export interface LoggerOptions {
	enabled: boolean;
	paused: boolean;
	logLevel: LogLevel;
	outputToFile: boolean;

	stringify: {
		jsonIndent: number;
		themes: Record<string, Theme>;
	}

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