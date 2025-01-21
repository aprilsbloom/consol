import supportsColor from 'supports-color';
import { ANSI_ESCAPE, hexToSimpleAnsiLUT, styles } from './consts';

export const hexToRGBLUT: Record<string, [red: number, green: number, blue: number]> = {}
for (const hex of Object.keys(hexToSimpleAnsiLUT)) {
	hexToRGBLUT[hex] = hexToRGB(hex);
}

export function findNearestHex(hex: string | [red: number, green: number, blue: number]): string {
	// convert hex to rgb if necessary
	let r: number;
	let g: number;
	let b: number;
	if (typeof hex === 'string') {
		hex = validateHex(hex);
		[r, g, b] = hexToRGB(hex);
	} else {
		[r, g, b] = hex;
	}

	// calculate similarity for each color in the LUT
	const similarities: Record<string, number> = {};
	for (const [hex, rgb] of Object.entries(hexToRGBLUT)) {
		const [r2, g2, b2] = rgb;

		const dr = r - r2;
		const dg = g - g2;
		const db = b - b2;

		const similarity = Math.sqrt(dr * dr + dg * dg + db * db);
		similarities[hex] = similarity;
	}

	// find the closest color
  let closest: string = '';
  let closestSimilarity = Number.NEGATIVE_INFINITY;
  for (const [hex, similarity] of Object.entries(similarities)) {
    if (similarity > closestSimilarity) {
      closest = hex;
      closestSimilarity = similarity;
    }
  }

	return closest;
}

export function hexToAnsi(hex: string, background: boolean = false): string {
	if (!supportsColor.stdout) return styles.reset;
	if (!supportsColor.stdout.hasBasic) return styles.reset;
	const [r, g, b] = hexToRGB(hex);

	// deal w 16m colors first
	if (supportsColor.stdout.has16m) {
		return `${ANSI_ESCAPE}[${background ? '48' : '38'};2;${r};${g};${b}m`;
	}

	// deal w 16 & 256 bit colors
	if (supportsColor.stdout.hasBasic || supportsColor.stdout.has256) {
		const tmpHex = findNearestHex([r, g, b]);
		const ansi = hexToSimpleAnsiLUT[tmpHex];
		if (!ansi) return styles.reset;
		return `${ANSI_ESCAPE}[${background ? '4' : '3'};${ansi}m`;
	}

	return styles.reset;
}

export function hexToRGB(hex: string): [number, number, number] {
	hex = validateHex(hex);

	const r = Number.parseInt(hex.slice(0, 2), 16);
	const g = Number.parseInt(hex.slice(2, 4), 16);
	const b = Number.parseInt(hex.slice(4, 6), 16);

	return [r, g, b];
}

export function validateHex(hex: string): string {
	hex = hex.toUpperCase();
	if (hex.startsWith('#')) hex = hex.slice(1);
	if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
	if (!/^[0-9A-F]{6}$/i.test(hex)) throw new Error('Invalid hex string!');
	return hex;
}
