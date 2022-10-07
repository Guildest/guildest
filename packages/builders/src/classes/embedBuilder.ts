import {
	ApiEmbed,
	ApiEmbedImage,
	ApiEmbedThumbnail,
	ApiEmbedAuthor,
	ApiEmbedField,
	ApiEmbedFooter,
	restMessageEmbedResolvable,
} from '@guildest/guilded-api-typings';
import {
	ColorResolver,
	ImageUrlResolver,
	UrlResolver,
	ColorResolvable,
	EmbedImageResolvable,
} from '../utils';

/** Represents the Chat Message or Webhook Message Embed Model Resolve for Guilded REST API. */
export type EmbedDataResolvable = restMessageEmbedResolvable | Record<string, unknown>;

/** Represents the Embed Author Resolvable for Embed Builder. */
export type EmbedAuthorResolvable = string | Record<string, unknown> | ApiEmbedAuthor;

/** Represents the Embed Footer Resolvable for Embed Builder. */
export type EmbedFooterResolvable = string | Record<string, unknown> | ApiEmbedFooter;

/** Represents the Embed Field Resolvable for Embed Builder. */
export type EmbedFieldResolvable = string | Record<string, unknown> | ApiEmbedField;

/**
 * Embed Builder for Message Embed Generations for Guilded REST API.
 * @example new EmbedBuilder({ title: "Embed Title!" })
 */

export class EmbedBuilder {
	/** Represents the Raw REST Embed API Data for Guilded API */
	public data: ApiEmbed = {};

	/** @param object The Raw Embed Data Resovable for Resolve by Builder. */
	constructor(object?: EmbedDataResolvable) {
		if (object) this.data = this.resolve(object!);
	}

	/**
	 * Set new Title on Embed by Replacing Old Data.
	 * @param value Embed Title String or void for removing Title.
	 * @returns Returns Embed Builder for continous method usage.
	 * @example EmbedBuilder.setTitle("New Title Mate?")
	 */

	public setTitle(value?: string): this {
		if (!value) this.data.title = undefined;
		else this.data.title = value;
		return this;
	}

	/**
	 * Set new Decription on Embed by Replacing Old Data.
	 * @param value Embed Decription String or void for removing Decription.
	 * @returns Returns Embed Builder for continous method usage.
	 * @example EmbedBuilder.setDescription("New Description Mate?")
	 */

	public setDescription(value?: string): this {
		if (!value) this.data.description = undefined;
		else this.data.description = value;
		return this;
	}

	/**
	 * Set new URL on Embed by Replacing Old Data.
	 * @param value Embed URL String or void for removing URL.
	 * @returns Returns Embed Builder for continous method usage.
	 * @example EmbedBuilder.setUrl("www.example.com")
	 */

	public setUrl(value?: string): this {
		if (!value) this.data.url = undefined;
		else this.data.url = UrlResolver(value, this.data?.url)?.[0];
		return this;
	}

	/**
	 * Set new Color on Embed by Replacing Old Data.
	 * @param value Embed Color or void for removing Color.
	 * @returns Returns Embed Builder for continous method usage.
	 * @example
	 * // Resolve the color with a hex color.
	 * EmbedBuilder.setColor(0xFFFFFF);
	 * EmbedBuilder.setColor('#FFFFFF');
	 *
	 * // Resolve the color with a preset color.
	 * EmbedBuilder.setColor('WHITE');
	 *
	 * // Resolve the color with RGB values.
	 * EmbedBuilder.setColor([255, 255, 255]);
	 */

	public setColor(value?: ColorResolvable): this {
		if (!value) this.data.color = undefined;
		else this.data.color = ColorResolver(value) ?? this.data?.color;
		return this;
	}

	/**
	 * Set new Footer on Embed by Replacing Old Data.
	 * @param value Embed Footer String or void for removing Footer.
	 * @returns Returns Embed Builder for continous method usage.
	 * @example EmbedBuilder.setFooter({ text: "Footer!" })
	 */

	public setFooter(value?: EmbedFooterResolvable): this {
		if (!value) this.data.footer = undefined;
		else this.data.footer = EmbedBuilder.footerResolver(value) ?? this.data.footer;
		return this;
	}

	/**
	 * Set new Timestamps on Embed by Replacing Old Data.
	 * @param value Embed Timestamps String or void for removing Timestamps.
	 * @returns Returns Embed Builder for continous method usage.
	 * @example EmbedBuilder.setTimestamps(new Date()})
	 */

	public setTimestamps(value?: string | number | Date): this {
		if (!value) this.data.timestamp = undefined;
		else this.data.timestamp = new Date(value).toISOString() ?? this.data.timestamp;
		return this;
	}

	/**
	 * Set new Thumbnail on Embed by Replacing Old Data.
	 * @param value Embed Thumbnail String or void for removing Thumbnail.
	 * @returns Returns Embed Builder for continous method usage.
	 * @example EmbedBuilder.setThumbnail("www.example.com/foo.png")
	 */

	public setThumbnail(value?: EmbedImageResolvable): this {
		if (!value) this.data.thumbnail = undefined;
		else this.data.thumbnail = ImageUrlResolver(value) ?? this.data.thumbnail;
		return this;
	}

	/**
	 * Set new Image on Embed by Replacing Old Data.
	 * @param value Embed Image String or void for removing Image.
	 * @returns Returns Embed Builder for continous method usage.
	 * @example EmbedBuilder.setImage("www.example.com/foo.png")
	 */

	public setImage(value?: EmbedImageResolvable): this {
		if (!value) this.data.image = undefined;
		else this.data.image = ImageUrlResolver(value) ?? this.data.image;
		return this;
	}

	/**
	 * Set new Author on Embed by Replacing Old Data.
	 * @param value Embed Author or void for removing Author.
	 * @returns Returns Embed Builder for continous method usage.
	 * @example EmbedBuilder.setAuthor({ name: "Embed Author"})
	 */

	public setAuthor(value?: EmbedAuthorResolvable): this {
		if (!value) this.data.author = undefined;
		else this.data.author = EmbedBuilder.authorResolver(value) ?? this.data.author;
		return this;
	}

	/**
	 * Set new Fields Array on Embed by Replacing Old Data.
	 * @param value Embed Fields Array or void for removing Fields Array.
	 * @returns Returns Embed Builder for continous method usage.
	 * @example EmbedBuilder.setFields([{ name: "Fields Name" , value: "Value!" }])
	 */

	public setFields(value?: EmbedFieldResolvable | Array<EmbedFieldResolvable>): this {
		if (!value) this.data.fields = undefined;
		else this.data.fields = EmbedBuilder.fieldsResolver(value) ?? this.data.fields;
		return this;
	}

	/**
	 * Add new Fields on Embed with preserved Data.
	 * @param value Embed Field for Adding Operation.
	 * @returns Returns Embed Builder for continous method usage.
	 * @example EmbedBuilder.addField({ name: "Fields Name" , value: "Value!" })
	 */

	public addField(value: EmbedFieldResolvable): this {
		if (!value) throw new TypeError('Invalid Embed Field has been Detected');
		const eFields = EmbedBuilder.fieldsResolver(value)?.filter(Boolean);
		if (!eFields) throw new TypeError(`Can't Resolve Fields Array with Raw Fields`);
		else if (!(this.data.fields && Array.isArray(this.data.fields))) this.data.fields = eFields;
		else this.data.fields?.push(...eFields!);
		this.data.fields.slice(0, 25);
		return this;
	}

	/**
	 * Add new Fields Array on Embed with preserved Data.
	 * @param value Embed Field Array for Adding Operation.
	 * @returns Returns Embed Builder for continous method usage.
	 * @example EmbedBuilder.addFields([{ name: "Fields Name" , value: "Value!" }])
	 */

	public addFields(value: Array<EmbedFieldResolvable>): this {
		if (!(value && Array.isArray(value)))
			throw new TypeError('Invalid Fields Array has been Detected');
		const eFields = EmbedBuilder.fieldsResolver(value)?.filter(Boolean);
		if (!eFields) throw new TypeError(`Can't Resolve Fields Array with Raw Fields`);
		else if (!(this.data.fields && Array.isArray(this.data.fields))) this.data.fields = eFields;
		else this.data.fields?.push(...eFields!);
		this.data.fields.slice(0, 25);
		return this;
	}

	/**
	 * Resolve New Object and Assign to the Api Data Resever Data.
	 * @param apiData Embed Data Resolvable for Embed Builder Data  assign.
	 * @returns Returns Api Embed Parsed Data from Raw Object.
	 * @example EmbedBuilder.resolve({ title: "Embed Builder" })
	 */

	public resolve(apiData: EmbedDataResolvable): ApiEmbed {
		return EmbedBuilder.resolveObject(apiData!, this.data);
	}

	/**
	 * Resolve New Object and Assign to the Given Assignable Object.
	 * @param apiData Embed Data Resolvable for Embed Builder Data  assign.
	 * @param assign Assiging Data if any given or won't assign anything.
	 * @returns Returns Api Embed Parsed Data from Raw Object.
	 * @example EmbedBuilder.resolveObject({ title: "Embed Builder" } , {})
	 */

	public static resolveObject(
		apiData: EmbedDataResolvable,
		assign?: Record<string, unknown> | object,
	): ApiEmbed {
		let embed: Record<string, unknown> = {};
		if (typeof apiData === 'string' && apiData.trim() !== '') embed = { description: apiData };
		else if (Array.isArray(apiData)) embed = { fields: apiData };
		else if (typeof apiData === 'object')
			embed = {
				title: typeof apiData.title === 'string' ? apiData.title : undefined,
				description:
					typeof apiData.description === 'string' ? apiData.description : undefined,
				url: UrlResolver(apiData.url!)?.[0],
				color: ColorResolver(apiData.color as any),
				timestamp: apiData.timestamp
					? new Date(apiData.timestamp as any).toISOString()
					: undefined,
				thumbnail: ImageUrlResolver(apiData.thumbnail!),
				image: ImageUrlResolver(apiData.image!),
				author: EmbedBuilder.authorResolver(apiData.author!),
				fields: EmbedBuilder.fieldsResolver(apiData.fields!),
				footer: EmbedBuilder.footerResolver(apiData.footer as any),
			};
		else throw new TypeError('Api Data is Invalid for Embed Builder for Guilded REST API');
		if (assign) Object.assign(assign, embed);
		return embed as ApiEmbed;
	}

	/** @ignore */

	private static authorResolver(apiData: EmbedAuthorResolvable): ApiEmbedAuthor | undefined {
		if (!apiData || typeof apiData === 'undefined') return undefined;
		let author: Record<string, unknown> = {};
		if (typeof apiData === 'string' && apiData.trim() !== '') author = { name: apiData };
		else if (typeof apiData === 'object' && !Array.isArray(apiData)) {
			author = {
				name: typeof apiData.name === 'string' ? apiData.name : undefined,
				url: UrlResolver(apiData.url!)?.[0],
				icon_url: ImageUrlResolver({ ...apiData, url: undefined })?.url,
			};
		} else throw new TypeError('Invalid Embed Author Object or String is Detected!');
		return author as ApiEmbedAuthor;
	}

	/** @ignore */

	private static fieldsResolver(
		apiData: EmbedFieldResolvable | Array<EmbedFieldResolvable>,
	): Array<ApiEmbedField> | undefined {
		if (!apiData || typeof apiData === 'undefined') return undefined;
		let fields: Array<ApiEmbedField> = [];
		if (typeof apiData === 'string' && apiData.trim() !== '')
			fields = [{ name: '** **', value: apiData }];
		else if (typeof apiData === 'object' && !Array.isArray(apiData)) {
			if (typeof apiData.name !== 'string' || typeof apiData.value !== 'string')
				throw new TypeError('Non-String Embed Field Name or Value is Detected!');
			else
				fields = [
					{
						name: typeof apiData.name === 'string' ? apiData.name : '** **',
						value: typeof apiData.value === 'string' ? apiData.value : undefined,
						inline: Boolean(apiData.inline),
					},
				];
		} else if (Array.isArray(apiData)) {
			fields = apiData
				.map((data: any) => {
					if (typeof data === 'string' && data.trim() !== '')
						return { name: '** **', value: data };
					else if (typeof data.name === 'string' || typeof data.value === 'string')
						return {
							name: typeof data.name === 'string' ? data.name : undefined,
							value: typeof data.value === 'string' ? data.value : undefined,
							inline: Boolean(data.inline),
						};
					else return undefined;
				})
				?.filter(Boolean)
				.slice(0, 25) as Array<ApiEmbedField>;
		} else throw new TypeError('Invalid Embed Fields Object or Array or String is Detected!');
		return fields;
	}

	/** @ignore */

	private static footerResolver(apiData: EmbedFooterResolvable): ApiEmbedFooter | undefined {
		if (!apiData || typeof apiData === 'undefined') return undefined;
		let footer: Record<string, unknown> = {};
		if (typeof apiData === 'string' && apiData.trim() !== '') footer = { text: apiData };
		else if (typeof apiData === 'object' && !Array.isArray(apiData)) {
			if (typeof apiData.text !== 'string')
				throw new TypeError('Non-String Embed Footer Text is Detected!');
			else
				footer = {
					text: apiData.text,
					icon_url: ImageUrlResolver(apiData)?.url,
				};
		} else throw new TypeError('Invalid Embed Footer Object or String is Detected!');
		return footer as unknown as ApiEmbedFooter;
	}

	/** Title of the Embed on Guilded REST API. */
	public get title(): string | undefined {
		return this.data?.title;
	}

	/** Description of the Embed on Guilded REST API. */
	public get description(): string | undefined {
		return this.data?.description;
	}

	/** Url of the Embed on Guilded REST API. */
	public get url(): string | undefined {
		return this.data?.url;
	}

	/** Color Number of the Embed on Guilded REST API. */
	public get color(): number | undefined {
		return this.data?.color;
	}

	/** Footer of the Embed on Guilded REST API. */
	public get footer(): ApiEmbedFooter | undefined {
		return this.data?.footer;
	}

	/** Timestamps of the Embed on Guilded REST API. */
	public get timestamp(): string | undefined {
		return this.data?.timestamp;
	}

	/** Thumbnail of the Embed on Guilded REST API. */
	public get thumbnail(): ApiEmbedThumbnail | undefined {
		return this.data?.thumbnail;
	}

	/** Image of the Embed on Guilded REST API. */
	public get image(): ApiEmbedImage | undefined {
		return this.data?.image;
	}

	/** Author of the Embed on Guilded REST API. */
	public get author(): ApiEmbedAuthor | undefined {
		return this.data?.author;
	}

	/** Array of Fields of the Embed on Guilded REST API. */
	public get fields(): Array<ApiEmbedField> | undefined {
		return this.data?.fields;
	}
}
