import * as linkify from 'linkifyjs';
import { ColorConstants } from './constants';

/**
 * Base Url Resolver for Builders
 * @param urls Array of Urls or Url String for Resolve
 * @param alt Alternative Url to Resolve if Urls got not valid Url
 * @returns Array of Urls after Resolve with Proper Protocols or Alt with no Resolve
 * @example UrlResolver("support@github.com")  // "mailto:support@github.com"
 */

export function UrlResolver(
	urls: Array<string> | string | unknown,
	alt?: string,
): Array<string> | undefined {
	if (!urls || typeof urls === 'undefined') return undefined;
	else if (urls && Array.isArray(urls)) urls = urls.join(' ');
	return (
		linkify
			.find(urls as string)
			?.filter((meta) => meta.href)
			?.map((meta) => meta?.href) ?? (alt ? [alt] : undefined)
	);
}

/** Represents the Embed Image Related Object Resolvable. */
export interface EmbedImageResolvable {
	url?: string;
	imageUrl?: string;
	image?: string;
	iconUrl?: string;
	iconurl?: string;
	icon?: string;
	icon_url?: string;
}

/**
 * Base Image Resolve Function to Resolve into Object for APIEmbed
 * @param data base Object or String Value consist of Url Value.
 * @param alt Alternative String Valued Url.
 * @returns Record object of url and Url Value.
 * @example ImageUrlResolver("abc")  // { url: "abc" }
 */

export function ImageUrlResolver(
	data: string | EmbedImageResolvable,
	alt?: string,
): Record<string, string> | undefined {
	let url: string | undefined;
	if (!data || typeof data === 'undefined') url = alt;
	else if (typeof data === 'string') url = UrlResolver(data)?.[0];
	else if (typeof data === 'object' && !Array.isArray(data))
		url = UrlResolver(
			data?.url ??
				data?.imageUrl ??
				data?.image ??
				data.icon_url ??
				data.icon ??
				data.iconUrl ??
				data.iconurl ??
				data.image ??
				data.imageUrl!,
		)?.[0];
	else throw new TypeError('Invalid Image URL Object or String is Detected!');

	if (url && typeof url === 'string' && url?.trim() !== '') return { url };
	else return undefined;
}

/** The color resolvable type. */
export type ColorResolvable =
	| `$${string}`
	| keyof typeof ColorConstants
	| 'RANDOM'
	| number
	| [r: number, g: number, b: number];

/**
 * Color Resolve to Decimal Value from RGB , Hex Value or Constants.
 * @param color Color Resolve Value.
 * @returns Color Decimal Value for Guilded Operations.
 * @example
 * // Resolve the color with a hex color.
 * ColorResolver(0xFFFFFF);
 * ColorResolver('#FFFFFF');
 *
 * // Resolve the color with a preset color.
 * ColorResolver('WHITE');
 *
 * // Resolve the color with RGB values.
 * ColorResolver([255, 255, 255]);
 */

export function ColorResolver(color: ColorResolvable): number {
	if (color === 'RANDOM') color = Math.floor(Math.random() * (0xffffff + 1));
	else if (typeof color === `string`)
		color = ColorConstants[color.toUpperCase()] ?? parseInt(color.replace('#', ''), 16);
	else if (Array.isArray(color)) color = (color[0] << 16) + (color[1] << 8) + color[2];
	return color as number;
}
