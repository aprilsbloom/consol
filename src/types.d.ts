export interface LoggerOptions {
	timeFormat: string;
	colors: {
		success: string;
		warning: string;
		error: string;
		info: string;
		debug: string;
	};
}