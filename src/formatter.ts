import strftime from "strftime";
import type { Options } from "./options";

export default class Formatter {
	private options: Options;

	private res: string;
	private regex: Record<'code' | 'date' | 'env' | 'hex' | 'style', RegExp> = {
		code: /!{code:([a-zA-Z\+\.\#-]+):([\s\S]+)}!/g,
		date: /!{date:(.+?)}!/g,
		env: /!{env:([a-zA-Z_]+)}!/g,
		hex: /!{hex:(b|f):(.+?)}!/g,
		style: /!{style:(.+?)}!/g,
	};

	constructor(
		opts: Options,
		format: string,
	) {
		this.options = opts;
		this.res = format;
	}

	public result(): string {
		return this.res;
	}

	public clone(): Formatter {
		return new Formatter(this.options, this.res);
	}

	public formatCode(): Formatter {
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
			return process.env[env] || "";
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