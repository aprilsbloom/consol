import { OptionsManager } from "./optionsManager";
import type { LoggerOptions } from "./types";

export class Consol {
	public options: OptionsManager;

	constructor(options: Partial<LoggerOptions> = {}) {
		this.options = new OptionsManager(options);
	}
}

export const consol = new Consol();

// consol.info('meow mrrp meow');
// consol.success('meow mrrp meow');
// consol.warning('meow mrrp meow');
// consol.debug('meow mrrp meow');
// consol.error('meow mrrp meow');
// consol.fatal('meow mrrp meow');