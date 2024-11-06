export function hexToAnsi(hex: string, background: boolean = false): string {
	if (!hex.startsWith('#')) hex = `#${hex}`;
	if (!/^#[0-9A-F]{6}$/i.test(hex)) throw new Error('Invalid hex color string!');

	const r = Number.parseInt(hex.slice(1, 3), 16).toString();
	const g = Number.parseInt(hex.slice(3, 5), 16).toString();
	const b = Number.parseInt(hex.slice(5, 7), 16).toString();

	return `\x1b${background ? '[48' : '[38'};2;${r};${g};${b}m`;
}