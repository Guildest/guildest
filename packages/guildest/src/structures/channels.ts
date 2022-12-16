import { ApiServerChannel, ApiChannelType } from '@guildest/api-typings';
import { Collection } from '@guildest/collection';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';
import { Message } from './messages';
import { ForumTopic } from './forums';
import { ListItem } from './listItems';
import { Doc } from './docs';
import { CalendarEvent } from './calenderEvents';
import { Webhook } from './webhooks';
import { Server } from './servers';

export class Channel extends Base<ApiServerChannel> {
	type: ApiChannelType;
	name: string;
	topic?: string;
	messages = new Collection<string, Message>();
	forumTopics = new Collection<string, ForumTopic>();
	listItems = new Collection<string, ListItem>();
	docs = new Collection<string, Doc>();
	calenderEvents = new Collection<string, CalendarEvent>();
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

		this.__update(json);
	}

	get server(): Server | undefined {
		return this.client.getServer(this.serverId);
	}

	get webhooks(): Collection<string, Webhook> | undefined {
		if (!this.server) return undefined;
		return this.server.webhooks.filter((webhook) => webhook.channelId === this.id);
	}

	__update(json: Partial<ApiServerChannel>) {
		if ('topic' in json) this.topic = json.topic;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
		if ('parentId' in json) this.parentId = json.parentId;
		if ('categoryId' in json) this.categoryId = json.categoryId;
		if ('isPublic' in json) this.isPublic = json.isPublic;
		if ('archivedBy' in json) this.archivedBy = json.archivedBy;
		if ('archivedAt' in json) this.archivedAt = json.archivedAt;
	}
}

export { ApiChannelType as ChannelTypes } from '@guildest/api-typings';
