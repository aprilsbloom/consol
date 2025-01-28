import type { Theme } from 'cli-highlight';

export type LogArgs = unknown[];
export type LogQueue = [LogLevel, LogArgs][];

// Options
export interface ConsolOptions {
	enabled: boolean;
	paused: boolean;
	level: LogLevel;

	formats: FormatOptions;
	levelFormats: LevelFormatOptions;

	stringify: StringifyOptions;
}

export interface FormatOptions {
	log: string;
	path: string;
}

export type LevelFormatOptions = Record<Exclude<LogType, 'none'>, LevelFormat>;
export interface LevelFormat {
	str: string;
	ansi?: string;
}

export type ThemeOptions = Record<string, Theme>;
export interface StringifyOptions {
	indent: number;
	themes: ThemeOptions;
}

export type StringifyFunc = (...args: unknown[]) => string;

// Log level
export enum LogLevel {
	Log,
	Info,
	Success,
	Warning,
	Error,
	Fatal,
	Debug,
	None = -999,
}

type EnumToLowercase<T> = keyof T extends infer K
	? Lowercase<K & string>
	: never;
export type LogType = EnumToLowercase<typeof LogLevel>;

export function logTypeToLogLevel(type: LogType): LogLevel {
	return (
		LogLevel[
			(type.charAt(0).toUpperCase() + type.slice(1)) as keyof typeof LogLevel
		] ?? LogLevel.None
	);
}

export function logLevelToLogType(level: LogLevel): LogType {
	return LogLevel[level].toLowerCase() as LogType;
}
