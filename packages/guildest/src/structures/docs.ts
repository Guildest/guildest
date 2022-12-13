import { ApiDocs, ApiBaseMentions } from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';

export class Doc extends Base<ApiDocs, number> {
	serverId: string;
	channelId: string;
	title?: string;
	content?: string;
	mentions?: ApiBaseMentions;
	createdAt: number;
	createdBy: string;
	updatedAt?: number;
	updatedBy?: string;
	constructor(client: Client, json: ApiDocs) {
		super(client, json);
		this.serverId = json.serverId;
		this.channelId = json.channelId;
		this.createdAt = Date.parse(json.createdAt);
		this.createdBy = json.createdBy;

		this.__update(json);
	}

	__update(json: Partial<ApiDocs>) {
		if ('mentions' in json) this.mentions = json.mentions;
		if ('title' in json) this.title = json.title;
		if ('content' in json) this.content = json.content;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
		if ('updatedBy' in json) this.updatedBy = json.updatedBy;
	}
}
