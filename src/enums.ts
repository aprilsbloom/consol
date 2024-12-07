import type { LogType } from "./types";

export enum LogLevel {
	Log,
	Info,
	Success,
	Warning,
	Error,
	Fatal,
	Debug,
}

export function logTypeToLogLevel(type: LogType): LogLevel {
	switch (type) {
		case 'log': return LogLevel.Log;
		case 'info': return LogLevel.Info;
		case 'success': return LogLevel.Success;
		case 'warning': return LogLevel.Warning;
		case 'error': return LogLevel.Error;
		case 'fatal': return LogLevel.Fatal;
		case 'debug': return LogLevel.Debug;
	}
	return -999 as LogLevel;
}

export function logLevelToLogType(level: LogLevel): LogType {
	return LogLevel[level].toLowerCase() as LogType;
}