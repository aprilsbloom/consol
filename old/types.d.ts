import type { Theme } from "cli-highlight";
import type { LogLevel } from "./enums";

type EnumToLowercase<T> = keyof T extends infer K ? Lowercase<K & string> : never;

export type StringifyFunc = (...args: any[]) => string;
export type LogType = EnumToLowercase<typeof LogLevel>;
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
		functions: FormatFunction[];
		level: Record<LogType, FormatResult>;
	}
}

export type RunAt = 'before' | 'after';
export interface FormatFunction {
	id: string;
	runAt: 'before' | 'after';
	func: (str: string) => string;
}

export interface FormatResult {
	str: string;
	ansi?: string;
}