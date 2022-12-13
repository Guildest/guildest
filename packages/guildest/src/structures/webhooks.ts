import { ApiWebhook } from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';

export class Webhook extends Base<ApiWebhook> {
	serverId: string;
	channelId: string;
	name?: string;
	createdAt: number;
	createdBy: string;
	deletedAt?: number;
	token?: string;
	constructor(client: Client, json: ApiWebhook) {
		super(client, json);
		this.serverId = json.serverId;
		this.channelId = json.channelId;
		this.createdAt = Date.parse(json.createdAt);
		this.createdBy = json.createdBy;

		this.__update(json);
	}

	__update(json: Partial<ApiWebhook>) {
		if ('name' in json) this.name = json.name;
		if ('deletedAt' in json) this.deletedAt = DateParse(json.deletedAt);
		if ('token' in json) this.token = json.token;
	}
}
