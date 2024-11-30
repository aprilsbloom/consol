import { mkdirSync, writeFileSync } from 'node:fs';

import { LogLevel } from "./enums";
import { Formatter } from "./formatter";
import { OptionsManager } from "./optionsManager";
import type { LoggerOptions } from "./types";

export class Consol {
	public options: OptionsManager;

	constructor(options: Partial<LoggerOptions> = {}) {
		this.options = new OptionsManager(options);
	}

	private writeToFile(level: LogLevel, msg: string) {
		const path = new Formatter(this.options, this.options.getFormat('path'))
			.formatDate()
			.formatLevelStr(level)
			.removeTemplates()
			.removeAnsi()
			.result();

		const dir = path.includes('/') ?
			path.split('/').slice(0, -1).join('/').trim():
			'';

		if (dir) mkdirSync(dir, { recursive: true });
		writeFileSync(path, `${msg}\n`, { flag: 'a' });
	}

	private logQueue: [LogLevel, any[]][] = [];
	public logMessage(level: LogLevel, args: any[]) {
		if (!this.options.shouldLog(level)) return;
		if (this.options.isPaused()) {
			this.logQueue.push([level, args]);
			return;
		}

		const msg = this.formatMessage(level, ...args);
		if (this.options.shouldOutputToFile()) this.writeToFile(level, msg.file);

		const reset = this.options.getStyle('reset');
		console.log(reset + msg.terminal + reset);
	}

	public formatMessage(level: LogLevel, ...args: any[]): {
		terminal: string;
		file: string;
	} {
		const msg = this.options.stringify(...args);
		const fmt = new Formatter(this.options, this.options.getFormat('log'));
		const result = {
			terminal: '',
			file: ''
		}

		result.terminal = fmt
			.formatDate()
			.formatMessage(msg)
			.formatRAM()
			.formatCPU()
			.formatHostname()
			.formatUsername()
			.formatUptime()
			.formatEnv()
			.formatUserFunctions()
			.result();

		// if writing to a file, we want to strip ansi codes and
		// any other template string (excl. level)
		if (this.options.shouldOutputToFile()) {
			result.file = fmt
				.clone()
				.formatLevelStr(level)
				.removeAnsi()
				.removeTemplates()
				.result();
		}

		// now we can add the actual level content,
		// styles & hex templates (they use ansi)
		result.terminal = fmt
			.formatLevelAnsi(level)
			.formatStyles()
			.formatHex()
			.formatCode()
			.result();

		return result;
	}

	public log(...args: any[]) {
		this.logMessage(LogLevel.Log, args);
	}

	public info(...args: any[]) {
		this.logMessage(LogLevel.Info, args);
	}

	public success(...args: any[]) {
		this.logMessage(LogLevel.Success, args);
	}

	public warning(...args: any[]) {
		this.logMessage(LogLevel.Warning, args);
	}

	public error(...args: any[]) {
		this.logMessage(LogLevel.Error, args);
	}

	public fatal(...args: any[]) {
		this.logMessage(LogLevel.Fatal, args);
		process.exit(1);
	}

	public debug(...args: any[]) {
		this.logMessage(LogLevel.Debug, args);
	}

	public enableLogging(): void {
		this.options.setEnabled(true);
	}

	public disableLogging(): void {
		this.options.setEnabled(false);
	}

	public pauseLogging(): void {
		this.options.setPaused(true);
	}

	public resumeLogging(): void {
		this.options.setPaused(false);

		for (const [level, args] of this.logQueue) {
			this.logMessage(level, args);
		}

		this.logQueue = [];
	}
}

export const consol = new Consol();
export const createConsol = (options: Partial<LoggerOptions> = {}) => new Consol(options);

export { LogLevel, logTypeToLogLevel, logLevelToLogType } from './enums';
export { hexToAnsi, hexToRGB, styles, ANSI_ESCAPE, SUPPORTED_LANGUAGES } from './utils';