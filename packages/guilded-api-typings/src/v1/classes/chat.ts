import { ApiBase, ApiBaseMentions } from './base';

/**
 * Represents Message Type on Guilded.
 * @see https://www.guilded.gg/docs/api/chat/ChatMessage
 */
export enum ApiMessageType {
	Default = 'default',
	System = 'system',
}

/**
 * Represents Message Value from Chat on Guilded.
 * @see https://www.guilded.gg/docs/api/chat/ChatMessage
 */
export interface ApiMessage extends ApiBase {
	/* The Channel Id of the Server where Chat Message is present in string. */
	channelId: string;
	/* Represent Type of the Message on Guilded. */
	type: ApiMessageType;
	/* The Server Id of the Server where Chat Message is present in string. */
	serverId: string;
	/* Represent the String Value as Normal Text Payload on Guilded in Message. */
	content?: string;
	/* Represent the Embed Payload on Guilded in Message. */
	embeds?: Array<ApiEmbed>;
	/* Represent Message Ids that has been Replied with (max-5,min-1). */
	replyMessageIds?: Array<string>;
	/* If Private Status of Chat-Message on Guilded. */
	isPrivate?: boolean;
	/* If Silent Status of Chat-Message on Guilded. */
	isSilent?: boolean;
	/* Represents Mentions along side of the Chat-Message Payload on Guilded. */
	mentions?: ApiBaseMentions;
	/* Created At Data/Time ISO-String Value on Guilded of Message. */
	createdAt: string;
	/* Created By User Id along the Message Data on Guilded. */
	createdBy: string;
	/* Webhook Id of the Message Payload Post on Guilded. */
	createdByWebhookId?: string;
	/* last Updated At Data/Time ISO-String Value on Guilded of Message. */
	updatedAt?: string;
}

/**
 * Represents Embed Value from Chat/Message on Guilded.
 * @see https://www.guilded.gg/docs/api/chat/ChatEmbed
 */
export interface ApiEmbed {
	/* Represent the Embed Title as MarkDown String on Guilded. */
	title?: string;
	/* Represent the Embed Description as MarkDown String on Guilded. */
	description?: string;
	/* Represent the Embed Url on Guilded. */
	url?: string;
	/* Represent the Decimal Value of Embed Color on Guilded. */
	color?: number;
	/* Represent the Embed Footer Value. */
	footer?: ApiEmbedFooter;
	/* Represent the Date/Time ISO String. */
	timestamp?: string;
	/* Represent the Embed Thumbnail Value. */
	thumbnail?: ApiEmbedThumbnail;
	/* Represent the Embed Image Value. */
	image?: ApiEmbedImage;
	/* Represent the Embed Author Value. */
	author?: ApiEmbedAuthor;
	/* Represent the Array of Embed Fields Value. */
	fields?: Array<ApiEmbedField>;
}

/**
 * Represents Embed Footer Value from Chat/Message on Guilded.
 * @see https://www.guilded.gg/docs/api/chat/ChatEmbed
 */
export interface ApiEmbedFooter {
	/* Represent the Footer Icon Media-Uri (valid) Value. */
	icon_url?: string;
	/* Represent the Footer Text String Value. */
	text: string;
}

/**
 * Represents Embed Thumbnail Value from Chat/Message on Guilded.
 * @see https://www.guilded.gg/docs/api/chat/ChatEmbed
 */
export interface ApiEmbedThumbnail {
	/* Represent the Thumbnail Media-Uri (valid) Value. */
	url?: string;
}

/**
 * Represents Embed Image Value from Chat/Message on Guilded.
 * @see https://www.guilded.gg/docs/api/chat/ChatEmbed
 */
export interface ApiEmbedImage {
	/* Represent the Image Media-Uri (valid) Value. */
	url?: string;
}

/**
 * Represents Embed Author Value from Chat/Message on Guilded.
 * @see https://www.guilded.gg/docs/api/chat/ChatEmbed
 */
export interface ApiEmbedAuthor {
	/* Represent Author's Name with max 256 length. */
	name?: string;
	/* Linkify Uri for Representing Author's Name. */
	url?: string;
	/* Represent the Author Icon Media-Uri (valid) Value. */
	icon_url?: string;
}

/**
 * Represents Embed Field's Value from Chat/Message on Guilded.
 * @see https://www.guilded.gg/docs/api/chat/ChatEmbed
 */
export interface ApiEmbedField {
	/* Represent the Field Name Property on Chat Embed. */
	name?: string;
	/* Represent the Field Value on Chat Embed. */
	value?: string;
	/* Represent the Field Inline Value on Chat Embed. */
	inline?: boolean;
}

/**
 * Represents Channel Message Edit Payload on Guilded.
 * @see https://www.guilded.gg/docs/api/chat/ChannelMessageUpdate
 */
export interface ApiChannelMessageEditPayload {
	/* Represent the String Value as Normal Text Payload on Guilded in Message. */
	content?: string;
	/* Represent the Embed Payload on Guilded in Message. */
	embeds?: Array<ApiEmbed>;
}

/**
 * Represents Channel Message Create Payload on Guilded.
 * @see https://www.guilded.gg/docs/api/chat/ChannelMessageCreate
 */
export interface ApiChannelMessagePayload extends ApiChannelMessageEditPayload {
	/* If Private Status of Chat-Message on Guilded. */
	isPrivate?: boolean;
	/* If Silent Status of Chat-Message on Guilded. */
	isSilent?: boolean;
	/* Represent Message Ids that has been Replied with (max-5,min-1). */
	replyMessageIds?: Array<string>;
}

/**
 * Represents Messages Fetch Request Options on Guilded.
 * @see https://www.guilded.gg/docs/api/chat/ChannelMessageReadMany
 */
export interface ApiMessagesFetchOptions {
	/* If Private Status of Chat-Message on Guilded. */
	before?: string;
	/* If Silent Status of Chat-Message on Guilded. */
	after?: string;
	/* Represent Message Ids that has been Replied with (max-5,min-1). */
	limit?: number;
	/* Represent the String Value as Normal Text Payload on Guilded in Message. */
	includePrivate?: boolean;
}
