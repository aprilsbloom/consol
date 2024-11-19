import type { OptionsManager } from "./optionsManager";
import strftime from "strftime";
import { LogLevel } from "./enums";
import type { LogType, Style } from "./types";
import { REGEX, hexToAnsi } from "./utils";

export class Formatter {
	private options: OptionsManager;
	private level: LogLevel;
	private res: string;

	constructor(
		options: OptionsManager,
		level: LogLevel,
		format: string,
	) {
		this.options = options;
		this.level = level;
		this.res = format;
	}

	public result(): string {
		return this.res;
	}

	public clone(): Formatter {
		return new Formatter(this.options, this.level, this.res);
	}

	public formatDate(): Formatter {
		this.res = this.res.replaceAll(REGEX.DATE, (_, date) => strftime(date));
		return this;
	}

	public formatLevelAnsi(): Formatter {
		this.res = this.res.replaceAll('!{level}', this.options.get().format.level[LogLevel[this.level].toLowerCase() as LogType].ansi!);
		return this;
	}

	public formatLevelStr(): Formatter {
		this.res = this.res.replaceAll('!{level}', this.options.get().format.level[LogLevel[this.level].toLowerCase() as LogType].str);
		return this;
	}

	public formatMessage(msg: string): Formatter {
		this.res = this.res.replaceAll('!{message}', msg);
		return this;
	}

	public formatStyles(): Formatter {
		this.res = this.res.replaceAll(REGEX.STYLES, (full, style: Style) => {
			const code = this.options.get().styles[style];
			if (!code) return full;
			return code;
		});

		return this;
	}

	public formatHex(): Formatter {
		this.res = this.res.replaceAll(REGEX.HEX, (_, type, hex) => {
			return hexToAnsi(hex, type === 'b');
		});

		return this;
	}

	public removeTemplates(): Formatter {
		this.res = this.res.replaceAll(REGEX.REMOVE_TEMPLATES, '');
		return this;
	}

	public removeAnsi(): Formatter {
		this.res = this.res.replaceAll(REGEX.REMOVE_ANSI, '');
		return this;
	}
}