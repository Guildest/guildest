import { ApiMessage, ApiMessageType, ApiEmbed, ApiBaseMentions } from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base, BaseReaction } from './base';
import { Client } from './client';
import { Server } from './servers';
import { Channel } from './channels';

/**
 * @class Message Class Represents the Interfaces of Message Model in Guilded API in Server.
 */
export class Message extends Base<ApiMessage> {
	/** Message Type Value for the message in Server. */
	type: ApiMessageType;
	/** Server Id of the Message in Guilded. */
	serverId?: string;
	/** Channel Id of the Message in Guilded. */
	channelId: string;
	/** Content of the Message in Guilded. */
	content?: string;
	/** Embeds of the Message in Guilded. */
	embeds?: Array<ApiEmbed>;
	/** Array of Reactions of the Message in Guilded. */
	reactions = new Array<BaseReaction>();
	/** Array of Replied Messages of the Message in Guilded. */
	replyMessageIds?: Array<string>;
	/** If Message is Private in Boolean Value */
	isPrivate?: boolean;
	/** If Message is Silently sent in Boolean Value */
	isSilent?: boolean;
	/** Related Mentions of the message */
	mentions?: ApiBaseMentions;
	/** Represents the Created Timestamp (ms) of the Message on Guilded API. */
	createdAt: number;
	/** Represents the Created By User Id of the message on Guilded API. */
	createdById: string;
	/** Represents the Webhook Creator Id of the message on Guilded API. */
	createdByWebhookId?: string;
	/** Represents the Last Updated Timestamp (ms) of the Message on Guilded API. */
	updatedAt?: number;

	/**
	 * Represents the message Class of the model on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example message = new Message(client,data)
	 */
	constructor(client: Client, json: ApiMessage) {
		super(client, json);
		this.channelId = json.channelId;
		this.type = json.type;
		this.createdAt = Date.parse(json.createdAt);
		this.createdById = json.createdBy;
		this._update(json);
	}

	/** Server model realted to the Doc in Guilded. */
	get server(): Server | undefined {
		if (!this.serverId) return undefined;
		return this.client.getServer(this.serverId);
	}

	/** Channel model realted to the Doc in Guilded. */
	get channel(): Channel | undefined {
		if (!this.channelId) return undefined;
		return this.client.getChannel(this.channelId);
	}

	/**
	 * Update function for Updating properties with changed data
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	_update(json: Partial<ApiMessage>) {
		if ('serverId' in json) this.serverId = json.serverId;
		if ('content' in json) this.content = json.content;
		if ('embeds' in json) this.embeds = json.embeds;
		if ('replyMessageIds' in json) this.replyMessageIds = json.replyMessageIds;
		if ('isPrivate' in json) this.isPrivate = json.isPrivate;
		if ('isSilent' in json) this.isSilent = json.isSilent;
		if ('mentions' in json) this.mentions = json.mentions;
		if ('createdByWebhookId' in json) this.createdByWebhookId = json.createdByWebhookId;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
	}
}

export { ApiMessageType as MessageTypes } from '@guildest/api-typings';
