import os from 'node:os';

import strftime from "strftime";
import { highlight } from 'cli-highlight';

import { type LogLevel, logLevelToLogType } from "./enums";
import type { OptionsManager } from "./optionsManager";
import type { Style } from "./types";
import { hexToAnsi, SUPPORTED_LANGUAGES } from "./utils";


const REGEX = {
	DATE: /!{date:(.*?%[\s\S])}!/g,
	STYLES: /!{styles:([a-z]+)}!/g,
	HEX: /!{hex:(b|f)g:(#?[0-9a-fA-F]{3}|#?[0-9a-fA-F]{6})}!/g,
	CODE: /!{code:([a-zA-Z\+\.\#-]+):([\s\S]+)}!/g,
	RAM: /!{ram:(free|used|total):(percent|bytes)}!/g,
	CPU: /!{cpu:(name|cores|speed|usage)}/g,
	REMOVE_TEMPLATES: /!{[^}]+}!/g,
	REMOVE_ANSI: /\x1b\[[^m]+m/g,
}

export class Formatter {
		private options: OptionsManager;
		private res: string;

		constructor(options: OptionsManager, format: string) {
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
			this.res = this.res.replaceAll("!{message}!", msg);
			return this;
		}

		public formatLevelAnsi(level: LogLevel): Formatter {
			const lvlFmt =
				this.options.getLevelFormat(logLevelToLogType(level)).ansi! +
				this.options.getStyle("reset");

			this.res = this.res.replaceAll("!{level}!", lvlFmt);
			return this;
		}

		public formatLevelStr(level: LogLevel): Formatter {
			const lvlFmt = this.options.getLevelFormat(logLevelToLogType(level)).str;
			this.res = this.res.replaceAll("!{level}!", lvlFmt);

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
				return hexToAnsi(hex, type === "b");
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

					return "0.00";
				},
			);

			return this;
		}

		public formatCPU(): Formatter {
			const cpus = os.cpus();
			if (!cpus.length) {
				console.log('no cpus lol');
				return this;
			}

			const names = cpus.map((c) => c.model).filter((val, ind, arr) => arr.indexOf(val) === ind);
			const cores = cpus.length;
			const speed = cpus[0].speed;

			this.res = this.res.replaceAll(REGEX.CPU, (_, type: 'name' | 'cores' | 'speed') => {
				if (type === 'name') return names.join(', ');
				if (type === 'cores') return cores.toString();
				if (type === 'speed') return speed.toString();
				return '';
			});

			return this;
		}

		public formatHostname(): Formatter {
			const hostname = os.hostname();
			this.res = this.res.replaceAll("!{hostname}!", hostname);
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

		public removeTemplates(): Formatter {
			this.res = this.res.replaceAll(REGEX.REMOVE_TEMPLATES, "");
			return this;
		}

		public removeAnsi(): Formatter {
			this.res = this.res.replaceAll(REGEX.REMOVE_ANSI, "");
			return this;
		}
	}