export type Color = 'success' | 'warning' | 'error' | 'info' | 'debug' | 'value';
export interface LoggerOptions {
	timeFormat: string;
	colors: {
		str: Record<Color, string>;
		ansi: Record<Color, string>;
	};
}