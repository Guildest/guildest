export function DateParse(isoString?: string | number): number | undefined {
	if (!isoString) return undefined;
	else if (typeof isoString === 'number') return isoString;
	else if (!isNaN(parseInt(isoString, 10))) return parseInt(isoString, 10);
	else if (typeof isoString === 'string') return Date.parse(isoString);
	else return undefined;
}
