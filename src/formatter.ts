import highlight from 'cli-highlight';
import strftime from 'strftime';
import type { Options } from './options';
import type { LogLevel } from './types';

export default class Formatter {
	private options: Options;
	private res: string;
	private level: LogLevel;
	private message: string;

	private regex: Record<'code' | 'date' | 'env' | 'hex' | 'style', RegExp> = {
		code: /!{code:([a-zA-Z\+\.\#-]+):([\s\S]+)}!/g,
		date: /!{date:(.+?)}!/g,
		env: /!{env:([a-zA-Z_]+)}!/g,
		hex: /!{hex:(b|f):(.+?)}!/g,
		style: /!{style:(.+?)}!/g,
	};

	constructor(opts: Options, format: string, level: LogLevel, message: string) {
		this.options = opts;
		this.res = format;
		this.level = level;
		this.message = message;
	}

	public result(): string {
		return this.res;
	}

	public clone(): Formatter {
		return new Formatter(this.options, this.res, this.level, this.message);
	}

	public formatMessage(): Formatter {
		this.res = this.res.replaceAll('!{message}!', this.message);
		return this;
	}

	public formatLevel(): Formatter {
		const level = this.options.getLevelFormat(this.level);
		const fmt = new Formatter(this.options, level, this.level, this.message)
			.formatDate()
			.formatCode()
			.formatEnv()
			.formatHex()
			.formatStyle();

		this.res = this.res.replaceAll('!{level}!', fmt.result());
		return this;
	}

	public formatCode(): Formatter {
		this.res = this.res.replaceAll(
			this.regex.code,
			(full: string, language: string, code: string) => {
				try {
					return highlight(code, {
						language,
						theme: this.options.getTheme(language),
					});
				} catch {
					return code;
				}
			},
		);

		return this;
	}

	public formatDate(): Formatter {
		this.res = this.res.replaceAll(this.regex.date, (_, date: string) => {
			return strftime(date);
		});
		return this;
	}

	public formatEnv(): Formatter {
		this.res = this.res.replaceAll(this.regex.env, (_, env: string) => {
			return process.env[env] || '';
		});
		return this;
	}

	public formatHex(): Formatter {
		return this;
	}

	public formatStyle(): Formatter {
		return this;
	}
}
