export function hexToAnsi(hex: string, background: boolean = false): string {
	hex = hex.toUpperCase();
	if (hex.startsWith('#')) hex = hex.slice(1);
	if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
	if (!/^[0-9A-F]{6}$/i.test(hex)) throw new Error('Invalid hex string!');

	const r = Number.parseInt(hex.slice(0, 2), 16).toString();
	const g = Number.parseInt(hex.slice(2, 4), 16).toString();
	const b = Number.parseInt(hex.slice(4, 6), 16).toString();

	return `\x1b[${background ? '48' : '38'};2;${r};${g};${b}m`;
}

