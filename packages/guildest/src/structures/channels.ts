import { ApiServerChannel, ApiChannelType } from '@guildest/api-typings';
import { Collection } from '@guildest/collection';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';
import { Message } from './messages';
import { ForumTopic } from './forums';
import { ListItem } from './listItems';
import { Doc } from './docs';
import { CalendarEvent } from './calendarEvents';
import { Webhook } from './webhooks';
import { Server } from './servers';

/** Channel Types for Guildest Client and for handlers for REST and Websocket */
export { ApiChannelType as ChannelTypes } from '@guildest/api-typings';

/** Channel that Support Content Payload Messages like content and Embed in Guilded for Resolve */
export type ChatSupportedChannel = ChatChannel | AnnouncementChannel;

/** Channel that Support Webhooks Modifications and Generators with REST API on Guilded. */
export type WebhookSupportedChannel = ChatChannel | ListChannel;

/**
 * 
 */
export class Channel extends Base<ApiServerChannel> {
	type: ApiChannelType | 'category';
	name: string;
	topic?: string;
	createdAt: number;
	createdBy: string;
	serverId: string;
	groupId: string;
	updatedAt?: number;
	parentId?: string;
	categoryId?: number;
	isPublic?: boolean;
	archivedBy?: string;
	archivedAt?: string;

	constructor(client: Client, json: ApiServerChannel) {
		super(client, json);
		this.type = json.type;
		this.name = json.name;
		this.createdAt = Date.parse(json.createdAt);
		this.createdBy = json.createdBy;
		this.serverId = json.serverId;
		this.groupId = json.groupId;

		this._update(json);
	}

	get server(): Server | undefined {
		return this.client.getServer(this.serverId);
	}

	_update(json: Partial<ApiServerChannel>) {
		if ('topic' in json) this.topic = json.topic;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
		if ('parentId' in json) this.parentId = json.parentId;
		if ('categoryId' in json) this.categoryId = json.categoryId;
		if ('isPublic' in json) this.isPublic = json.isPublic;
		if ('archivedBy' in json) this.archivedBy = json.archivedBy;
		if ('archivedAt' in json) this.archivedAt = json.archivedAt;
	}
}

export class CategoryChannel extends Channel {
	channels = new Collection<string, Channel>();
	constructor(client: Client, json: ApiServerChannel) {
		super(client, json);
		this.type = 'category';
	}
}

export class AnnouncementChannel extends Channel {
	messages = new Collection<string, Message>();
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Announcement });
	}
}

export class ChatChannel extends Channel {
	messages = new Collection<string, Message>();
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Chat });
	}

	get webhooks(): Collection<string, Webhook> | undefined {
		if (!this.server) return undefined;
		return this.server.webhooks.filter((webhook) => webhook.channelId === this.id);
	}
}

export class ForumChannel extends Channel {
	forumTopics = new Collection<string, ForumTopic>();
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Forums });
	}
}

export class ListChannel extends Channel {
	items = new Collection<string, ListItem>();
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.ListItem });
	}

	get webhooks(): Collection<string, Webhook> | undefined {
		if (!this.server) return undefined;
		return this.server.webhooks.filter((webhook) => webhook.channelId === this.id);
	}
}

export class DocChannel extends Channel {
	docs = new Collection<string, Doc>();
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Docs });
	}
}

export class CalendarEventChannel extends Channel {
	calendarEvents = new Collection<string, CalendarEvent>();
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Calendar });
	}
}

export class MediaChannel extends Channel {
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Media });
	}
}

export class VoiceChannel extends Channel {
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Voice });
	}
}

export class StreamChannel extends Channel {
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Stream });
	}
}

export class SchedulingChannel extends Channel {
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Scheduling });
	}
}
