import { ApiMessage, ApiMessageType, ApiEmbed, ApiBaseMentions } from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base, BaseReaction } from './base';
import { Client } from './client';
import { Server } from './servers';
import { Channel } from './channels';

export class Message extends Base<ApiMessage> {
	type: ApiMessageType;
	serverId?: string;
	channelId: string;
	content?: string;
	embeds?: Array<ApiEmbed>;
	reactions = new Array<BaseReaction>();
	replyMessageIds?: Array<string>;
	isPrivate?: boolean;
	isSilent?: boolean;
	mentions?: ApiBaseMentions;
	createdAt: number;
	createdBy: string;
	createdByWebhookId?: string;
	updatedAt?: number;
	constructor(client: Client, json: ApiMessage) {
		super(client, json);
		this.type = json.type;
		this.channelId = json.channelId;
		this.createdAt = Date.parse(json.createdAt);
		this.createdBy = json.createdBy;

		this.__update(json);
	}

	get server(): Server | undefined {
		if (!this.serverId) return undefined;
		return this.client.getServer(this.serverId);
	}

	get channel(): Channel | undefined {
		if (!this.serverId) return undefined;
		return this.client.getChannel(this.channelId);
	}

	__update(json: Partial<ApiMessage>) {
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
