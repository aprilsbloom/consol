import type { ConsolOptions } from "./types";
import { Options } from "./options";

export class Consol {
	public options: Options;

	constructor(opts: Partial<ConsolOptions> = {}) {
		this.options = new Options(opts);
	}
}

export const consol = new Consol();
export const createConsol = (opts: Partial<ConsolOptions>) => new Consol(opts);