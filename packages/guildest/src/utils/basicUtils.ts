/**
 * Parsing of string resolve like ISO string of Date() to timestamp (ms) number
 * @param isoString ISO string value of Date()
 * @returns timestamp (ms) in number or undefined on failure
 * @example DateParse("abc") // 090198
 */
export function DateParse(isoString?: string | number): number | undefined {
	if (!isoString) return undefined;
	else if (typeof isoString === 'number') return isoString;
	else if (!isNaN(parseInt(isoString, 10))) return parseInt(isoString, 10);
	else if (typeof isoString === 'string') return Date.parse(isoString);
	else return undefined;
}
