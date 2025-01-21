import type { Theme } from 'cli-highlight';

// Options
export interface ConsolOptions {
	enabled: boolean;
	paused: boolean;
	level: LogLevel;
	stringify: StringifyOptions;
}

export interface StringifyOptions {
	indent: number;
	themes: Record<string, Theme>;
}

// Log level
export enum LogLevel {
	Log,
	Info,
	Success,
	Warning,
	Error,
	Fatal,
	Debug,
	None = -999
}

type EnumToLowercase<T> = keyof T extends infer K ? Lowercase<K & string> : never;
export type LogType = EnumToLowercase<typeof LogLevel>;

export function logTypeToLogLevel(type: LogType): LogLevel {
	return LogLevel[type.charAt(0).toUpperCase() + type.slice(1) as keyof typeof LogLevel] ?? LogLevel.None;
}

export function logLevelToLogType(level: LogLevel): LogType {
	return LogLevel[level].toLowerCase() as LogType;
}