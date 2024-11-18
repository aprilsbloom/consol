import { OptionsManager } from "./optionsManager";
import type { LoggerOptions } from "./types";

export class Consol {
	public options: OptionsManager;

	constructor(options: Partial<LoggerOptions> = {}) {
		this.options = new OptionsManager(options);
	}
}

export const consol = new Consol();