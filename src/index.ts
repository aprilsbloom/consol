import type { ConsolOptions, LogArgs } from "./types";
import { LogLevel } from "./types";
import { Options } from "./options";


export class Consol {
	public options: Options;

	constructor(opts: Partial<ConsolOptions> = {}) {
		this.options = new Options(this, opts);
	}

	public custLog(level: LogLevel, args: LogArgs): string {
		// add log args to queue if paused
		if (this.options.isPaused()) {
			this.options.addLogToQueue(level, args);
			return "";
		}

		// return nothing if logging is disabled / level is below threshold
		if (!this.options.canLog(level)) return "";

		// stringify args


		return "";
	}

	public log(...args: LogArgs): string {
		return this.custLog(LogLevel.Log, args);
	}

	public info(...args: LogArgs): string {
		return this.custLog(LogLevel.Info, args);
	}

	public success(...args: LogArgs): string {
		return this.custLog(LogLevel.Success, args);
	}

	public warning(...args: LogArgs): string {
		return this.custLog(LogLevel.Warning, args);
	}

	public error(...args: LogArgs): string {
		return this.custLog(LogLevel.Error, args);
	}

	public fatal(...args: LogArgs): string {
		return this.custLog(LogLevel.Fatal, args);
	}

	public debug(...args: LogArgs): string {
		return this.custLog(LogLevel.Debug, args);
	}

	public enable() {
		this.options.enable();
	}

	public disable() {
		this.options.disable();
	}

	public pause() {
		this.options.pause();
	}

	public resume() {
		this.options.resume();
	}
}

export const consol = new Consol();
export const createConsol = (opts: Partial<ConsolOptions>) => new Consol(opts);