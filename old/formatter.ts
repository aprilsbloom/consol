import os from 'node:os';
import { highlight } from 'cli-highlight';
import strftime from "strftime";
import { SUPPORTED_LANGUAGES } from "./consts";
import type { LogLevel } from "./enums";
import type { Options } from "./options";
import type { RunAt, Style } from "./types";
import { hexToAnsi } from "./utils";

const REGEX = {
	CODE: /!{code:([a-zA-Z\+\.\#-]+):([\s\S]+)}!/g,
	CPU: /!{cpu:(name|cores|speed)}/g,
	DATE: /!{date:(.*?%[\s\S])}!/g,
	ENV: /!{env:([a-zA-Z0-9_]+)}!/g,
	HEX: /!{hex:(b|f)g:(#?[0-9a-fA-F]{3}|#?[0-9a-fA-F]{6})}!/g,
	RAM: /!{ram:(free|used|total):(percent|bytes)}!/g,
	REMOVE_ANSI: /\x1b\[[^m]+m/g,
	REMOVE_TEMPLATES: /!{[^}]+}!/g,
	STYLES: /!{styles:([a-z]+)}!/g,
	UPTIME: /!{uptime:(.*?%[\s\S])}!/g,
}

export class Formatter {
	private options: Options;
	private res: string;

	constructor(options: Options, format: string) {
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
		this.res = this.res.replaceAll(REGEX.DATE, (_, date: string) => strftime(date));
		return this;
	}

	public formatMessage(msg: string): Formatter {
		this.res = this.res.replaceAll("!{message}!", msg);
		return this;
	}

	public formatLevelAnsi(level: LogLevel): Formatter {
		const lvlFmt =
			this.options.getLevelFormat(level).ansi! +
			this.options.getStyle("reset");

		this.res = this.res.replaceAll("!{level}!", lvlFmt);
		return this;
	}

	public formatLevelStr(level: LogLevel): Formatter {
		const lvlFmt = this.options.getLevelFormat(level).str;
		this.res = this.res.replaceAll("!{level}!", lvlFmt);
		return this;
	}

	public formatStyles(): Formatter {
		this.res = this.res.replaceAll(REGEX.STYLES, (_, style: Style) => {
			const code = this.options.getStyle(style);
			if (!code) return "";
			return code;
		});

		return this;
	}

	public formatHex(): Formatter {
		this.res = this.res.replaceAll(REGEX.HEX, (_, type: 'b' | 'f', hex: string) => {
			return hexToAnsi(hex, type === "b");
		});

		return this;
	}

	public formatCode(): Formatter {
		this.res = this.res.replaceAll(REGEX.CODE, (_, lang: string, code: string) => {
			lang = lang.toLowerCase().trim();
			if (!SUPPORTED_LANGUAGES.includes(lang)) return code;

			try {
				return highlight(code, { language: lang, theme: this.options.getTheme(lang) });
			} catch {
				return code;
			}
		});

		return this;
	}

	public formatRAM(): Formatter {
		const total = os.totalmem();
		const free = os.freemem();
		const used = total - free;

		this.res = this.res.replaceAll(
			REGEX.RAM,
			(_, valType: "free" | "used" | "total", fmt: "percent" | "bytes") => {
				if (fmt === "percent") {
					if (valType === "free") return ((free / total) * 100).toFixed(2);
					if (valType === "used") return ((used / total) * 100).toFixed(2);
					if (valType === "total") return "100.00";
				} else if (fmt === "bytes") {
					if (valType === "free") return free.toString();
					if (valType === "used") return used.toFixed(2);
					if (valType === "total") return total.toString();
				}

				return "";
			},
		);

		return this;
	}

	public formatCPU(): Formatter {
		const cpus = os.cpus();
		if (!cpus.length) return this;

		const names = cpus
			.map((c) => c.model)
			.filter((val, ind, arr) => arr.indexOf(val) === ind);

		const cores = cpus.length;

		const speed = cpus
			.map(c => c.speed)
			.filter((val, ind, arr) => arr.indexOf(val) === ind)
			.sort()[0];

		this.res = this.res.replaceAll(REGEX.CPU, (_, type: 'name' | 'cores' | 'speed') => {
			if (type === 'name') return names.join(', ');
			if (type === 'cores') return cores.toString();
			if (type === 'speed') return speed.toString();
			return "";
		});

		return this;
	}

	public formatHostname(): Formatter {
		this.res = this.res.replaceAll("!{hostname}!", os.hostname());
		return this;
	}

	public formatUsername(): Formatter {
		let username: string;
		try {
			username = os.userInfo().username;
		} catch {
			return this;
		}

		this.res = this.res.replaceAll("!{username}!", username);
		return this;
	}

	public formatUptime(): Formatter {
		// unix timestamps start at 1/1/1970 12:00:00 AM,
		// so we need to subtract 12 hours to get the correct uptime
		const uptime = (os.uptime() * 1000) - (12 * 1000 * 60 * 60);

		this.res = this.res.replaceAll(REGEX.UPTIME, (_, fmt: string) => {
			return strftime(fmt, new Date(uptime));
		});

		return this;
	}

	public formatEnv(): Formatter {
		this.res = this.res.replaceAll(REGEX.ENV, (_, key: string) => {
			return process.env[key] || "";
		});

		return this;
	}

	public formatUserFunctions(runAt: RunAt): Formatter {
		const funcs = this.options.getFormatFuncs();
		for (const fmt of funcs) {
			if (fmt.runAt !== runAt) continue;
			this.res = fmt.func(this.res)
		}

		return this;
	}

	public removeTemplates(): Formatter {
		this.res = this.res.replaceAll(REGEX.REMOVE_TEMPLATES, "");
		return this;
	}

	public removeAnsi(): Formatter {
		this.res = this.res.replaceAll(REGEX.REMOVE_ANSI, "");
		return this;
	}
}