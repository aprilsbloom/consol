import strftime from "strftime";
import { LogLevel } from "./enums";
import type { OptionsManager } from "./optionsManager";
import type { LogType, Style } from "./types";

const REGEX = {
	DATE: /!{date:(.*?%[\s\S])}/g,
	STYLES: /!{styles.([\s\S]+)}/g,
	HEX: /!{hex:(b|f)g:(#?[0-9a-fA-F]{3}|#?[0-9a-fA-F]{6})}/g,
	REMOVE_TEMPLATES: /!{[^}]+}/g,
	REMOVE_ANSI: /\x1b\[[^m]+m/g,
}

function hexToAnsi(hex: string, background: boolean = false): string {
	hex = hex.toUpperCase();
	if (hex.startsWith('#')) hex = hex.slice(1);
	if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
	if (!/^[0-9A-F]{6}$/i.test(hex)) throw new Error('Invalid hex string!');

	const r = Number.parseInt(hex.slice(0, 2), 16).toString();
	const g = Number.parseInt(hex.slice(2, 4), 16).toString();
	const b = Number.parseInt(hex.slice(4, 6), 16).toString();

	return `\x1b[${background ? '48' : '38'};2;${r};${g};${b}m`;
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