import { mkdirSync, writeFileSync } from 'node:fs';
import { LogLevel } from "./enums";
import { Formatter } from "./formatter";
import { OptionsManager } from "./optionsManager";
import type { LoggerOptions } from "./types";

export class Consol {
	public options: OptionsManager;
	private logQueue: [LogLevel, any[]][] = [];

	constructor(options: Partial<LoggerOptions> = {}) {
		this.options = new OptionsManager(options);
	}

	/**
	 * Write a formatted log message to a file.
	 *
	 * @private
	 * @param {LogLevel} level
	 * @param {string} msg
	 * @memberof Consol
	 */
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

	/**
	 * Logs a message to the console.
	 *
	 * @param {LogLevel} level
	 * @param {any[]} args
	 * @memberof Consol
	 */
	public logMessage(level: LogLevel, ...args: any[]): void {
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

	/**
	 * Formats a message for logging.
	 *
	 * @param {LogLevel} level
	 * @param {...any[]} args
	 * @return {{
	 * 	terminal: string;
	 * 	file: string;
	 * }}
	 * @memberof Consol
	 */
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
			.formatUserFunctions('before')
			.formatDate()
			.formatMessage(msg)
			.formatRAM()
			.formatCPU()
			.formatHostname()
			.formatUsername()
			.formatUptime()
			.formatEnv()
			.formatUserFunctions('after')
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

		// now we can add the template values that use ansi
		result.terminal = fmt
			.formatLevelAnsi(level)
			.formatStyles()
			.formatHex()
			.formatCode()
			.result();

		return result;
	}

	public log(...args: any[]): void {
		this.logMessage(LogLevel.Log, args);
	}

	public info(...args: any[]): void {
		this.logMessage(LogLevel.Info, args);
	}

	public success(...args: any[]): void {
		this.logMessage(LogLevel.Success, args);
	}

	public warning(...args: any[]): void {
		this.logMessage(LogLevel.Warning, args);
	}

	public error(...args: any[]): void {
		this.logMessage(LogLevel.Error, args);
	}

	public fatal(...args: any[]): void {
		this.logMessage(LogLevel.Fatal, args);
		process.exit(1);
	}

	public debug(...args: any[]): void {
		this.logMessage(LogLevel.Debug, args);
	}

	public enableLogging(): void {
		this.options.setEnabled(true);
	}

	public disableLogging(): void {
		this.options.setEnabled(false);
	}

	/**
	 * Pauses logging.
	 *
	 * All messages logged in the meantime will be queued,
	 * and flushed once logging is resumed.
	 *
	 * @memberof Consol
	 */
	public pauseLogging(): void {
		this.options.setPaused(true);
	}

	/**
	 * Resumes logging if it was paused.
	 *
	 * NOTE: Upon resuming, all messages that were queued
	 * while logging was paused will be logged.
	 *
	 * @memberof Consol
	 */
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

export { LogLevel, logLevelToLogType, logTypeToLogLevel } from './enums';
export { ANSI_ESCAPE, hexToAnsi, hexToRGB, styles, SUPPORTED_LANGUAGES } from './utils';
