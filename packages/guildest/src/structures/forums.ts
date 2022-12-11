import { ApiBaseMentions, ApiForumTopic, ApiForumTopicComment } from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';

export class ForumTopic extends Base<ApiForumTopic> {
	serverId: string;
	channelId: string;
	title: string;
	createdAt: number;
	createdBy: string;
	createdByWebhookId?: string;
	updatedAt?: number;
	bumpedAt?: number;
	isPinned?: boolean;
	isLocked?: boolean;
	content?: string;
	mentions?: ApiBaseMentions;
	constructor(client: Client, json: ApiForumTopic) {
		super(client, json);
		this.serverId = json.serverId;
		this.channelId = json.channelId;
		this.title = json.title;
		this.createdAt = Date.parse(json.createdAt);
		this.createdBy = json.createdBy;
	}

	__update(json: Partial<ApiForumTopic>) {
		if ('createdByWebhookId' in json) this.createdByWebhookId = json.createdByWebhookId;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
		if ('bumpedAt' in json) this.bumpedAt = DateParse(json.bumpedAt);
		if ('isPinned' in json) this.isPinned = json.isPinned;
		if ('isLocked' in json) this.isLocked = json.isLocked;
		if ('content' in json) this.content = json.content;
		if ('mentions' in json) this.mentions = json.mentions;
	}
}

export class ForumTopicComment extends Base<ApiForumTopicComment> {
	content?: string;
	createdAt: number;
	updatedAt?: number;
	channelId: string;
	forumTopicId: string;
	createdBy: string;
	mentions?: ApiBaseMentions;
	constructor(client: Client, json: ApiForumTopicComment) {
		super(client, json);
		this.createdAt = Date.parse(json.createdAt);
		this.channelId = json.channelId;
		this.forumTopicId = json.forumTopicId;
		this.createdBy = json.createdBy;
		this.__update(json);
	}

	__update(json: Partial<ApiForumTopicComment>) {
		if ('content' in json) this.content = json.content;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
		if ('mentions' in json) this.mentions = json.mentions;
	}
}
