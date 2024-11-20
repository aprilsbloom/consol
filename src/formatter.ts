import strftime from "strftime";
import { LogLevel } from "./enums";
import type { OptionsManager } from "./optionsManager";
import type { LogType, Style } from "./types";
import { hexToAnsi } from "./utils";

const REGEX = {
	DATE: /!{date:(.*?%[\s\S])}/g,
	STYLES: /!{styles.([\s\S]+)}/g,
	HEX: /!{hex:(b|f)g:(#?[0-9a-fA-F]{3}|#?[0-9a-fA-F]{6})}/g,
	REMOVE_TEMPLATES: /!{[^}]+}/g,
	REMOVE_ANSI: /\x1b\[[^m]+m/g,
}

export class Formatter {
	private options: OptionsManager;
	private res: string;

	constructor(
		options: OptionsManager,
		format: string,
	) {
		this.options = options;
		this.res = format;
	}

	public result(): string {
		return this.res;
	}

	public clone(): Formatter {
		return new Formatter(this.options, this.res);
	}

	public formatDate(): Formatter {
		this.res = this.res.replaceAll(REGEX.DATE, (_, date) => strftime(date));
		return this;
	}

	public formatLevelAnsi(level: LogLevel): Formatter {
		this.res = this.res.replaceAll(
			'!{level}',
			this.options.getLevelFormat(LogLevel[level].toLowerCase() as LogType).ansi!
		);

		return this;
	}

	public formatLevelStr(level: LogLevel): Formatter {
		this.res = this.res.replaceAll(
			'!{level}',
			this.options.getLevelFormat(LogLevel[level].toLowerCase() as LogType).str
		);

		return this;
	}

	public formatMessage(msg: string): Formatter {
		this.res = this.res.replaceAll('!{message}', msg);
		return this;
	}

	public formatStyles(): Formatter {
		this.res = this.res.replaceAll(REGEX.STYLES, (full, style: Style) => {
			const code = this.options.getStyle(style);
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