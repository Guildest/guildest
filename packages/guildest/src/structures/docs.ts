import { ApiDocs, ApiBaseMentions } from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';
import { Server } from './servers';
import { Channel } from './channels';

export class Doc extends Base<ApiDocs> {
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
		super(client, Object.assign({}, json, { id: json.id.toString() }));
		this.serverId = json.serverId;
		this.channelId = json.channelId;
		this.createdAt = Date.parse(json.createdAt);
		this.createdBy = json.createdBy;

		this._update(json);
	}

	get server(): Server | undefined {
		return this.client.getServer(this.serverId);
	}

	get channel(): Channel | undefined {
		if (!this.channelId) return undefined;
		return this.client.getChannel(this.channelId);
	}

	_update(json: Partial<ApiDocs>) {
		if ('mentions' in json) this.mentions = json.mentions;
		if ('title' in json) this.title = json.title;
		if ('content' in json) this.content = json.content;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
		if ('updatedBy' in json) this.updatedBy = json.updatedBy;
	}
}
