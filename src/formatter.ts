import strftime from "strftime";
import { type LogLevel, logLevelToLogType } from "./enums";
import type { OptionsManager } from "./optionsManager";
import type { Style } from "./types";
import { hexToAnsi, SUPPORTED_LANGUAGES } from "./utils";
import { highlight } from 'cli-highlight';

const REGEX = {
	DATE: /!{date:(.*?%[\s\S])}!/g,
	STYLES: /!{styles:([a-z]+)}!/g,
	HEX: /!{hex:(b|f)g:(#?[0-9a-fA-F]{3}|#?[0-9a-fA-F]{6})}!/g,
	CODE: /!{code:([a-zA-Z\+\.\#-]+):([\s\S]+)}!/g,
	REMOVE_TEMPLATES: /!{[^}]+}!/g,
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

	public formatMessage(msg: string): Formatter {
		this.res = this.res.replaceAll('!{message}!', msg);
		return this;
	}

	public formatLevelAnsi(level: LogLevel): Formatter {
		this.res = this.res.replaceAll(
			'!{level}!',
			this.options.getLevelFormat(logLevelToLogType(level)).ansi!
		);

		return this;
	}

	public formatLevelStr(level: LogLevel): Formatter {
		this.res = this.res.replaceAll(
			'!{level}!',
			this.options.getLevelFormat(logLevelToLogType(level)).str
		);

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

	public formatCode(): Formatter {
		this.res = this.res.replaceAll(REGEX.CODE, (full, lang, code) => {
			lang = lang.toLowerCase().trim();
			if (!SUPPORTED_LANGUAGES.includes(lang)) return full;

			try {
				const res = highlight(code, { language: lang });
				return res;
			} catch (e) {
				return full;
			}
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