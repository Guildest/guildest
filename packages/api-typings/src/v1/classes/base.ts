/**
 * Represents Base Class of Guilded Class.
 */
export interface ApiBase {
	/* The Id of the Base Class in string. */
	id: string;
}

/**
 * Represents mentions with Channel/Message Payloads or WebSocket's Events on Guilded.
 * @see https://www.guilded.gg/docs/api/channels/Mentions
 */
export interface ApiBaseMentions {
	/** The users that were mentioned. */
	users?: Array<ApiBase>;
	/** The channels that were mentioned. */
	channels?: Array<ApiBase>;
	/** The roles that were mentioned. */
	roles?: Array<{ id: number }>;
	/** Whether everyone was mentioned. */
	everyone?: boolean;
	/** Whether here was mentioned. */
	here?: boolean;
}

/**
 * Represents Base Emote on Guilded.
 * @see https://www.guilded.gg/docs/api/emote/Emote
 */
export interface ApiBaseEmote {
	/* Represents Api Emote Id on Guilded */
	id: number;
	/* Represents Api Emote Name on Guilded */
	name: string;
	/* Represents Api Emote Url on Guilded */
	url: string;
}

/**
 * Represents Message Reactions(Add/Delete) WS Event on Guilded.
 * @see https://www.guilded.gg/docs/api/reactions/ContentReactionCreate
 */
export interface ApiBaseReaction {
	/* Represents Api Reaction's Channel Id on Guilded */
	channelId: string;
	/* Represents Api Reaction's Message Id on Guilded */
	messageId: string;
	/* Represents Api Reaction's Created By User Id (related) on Guilded */
	createdBy: string;
	/* Represents Api Emote related to Reaction on Guilded */
	emote: ApiBaseEmote;
}

/**
 * Represents User Type on Guilded.
 * @see https://www.guilded.gg/docs/api/members/User
 */
export enum ApiBaseUserType {
	Bot = 'bot',
	User = 'user',
}

/**
 * Represents User Data Summary(LTE) on Guilded.
 * @see https://www.guilded.gg/docs/api/members/UserSummary
 */
export interface ApiBaseUserSummary extends ApiBase {
	/* Id of the User as Unique Identifer on Guilded. */
	id: string;
	/* Type of the User on Guilded. */
	type?: ApiBaseUserType;
	/* Name/User-Name of User on Guilded. */
	name: string;
	/* Avatar as Media-Uri of User on Guilded. */
	avatar?: string;
}

/**
 * Represents User Complete-Data on Guilded.
 * @see https://www.guilded.gg/docs/api/members/User
 */
export interface ApiBaseUser extends ApiBaseUserSummary {
	/* Banner as Media-Uri of User on Guilded. */
	banner?: string;
	/* Created At Data/Time ISO-String Value for User Creation on Guilded. */
	createdAt: string;
}
