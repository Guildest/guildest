import { ApiBaseMentions, ApiListItemNoteResolve, ApiListItemResolve } from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';

export class ListItem extends Base<ApiListItemResolve> {
	serverId: string;
	channelId: string;
	message: string;
	createdAt: number;
	createdBy: string;
	mentions?: ApiBaseMentions;
	createdByWebhookId?: string;
	updatedAt?: number;
	updatedBy?: string;
	parentListItemId?: string;
	completedAt?: number;
	completedBy?: string;
	note?: ApiListItemNoteResolve;
	constructor(client: Client, json: ApiListItemResolve) {
		super(client, json);
		this.serverId = json.serverId;
		this.channelId = json.channelId;
		this.message = json.message;
		this.createdAt = Date.parse(json.createdAt);
		this.createdBy = json.createdBy;

		this._update(json);
	}

	_update(json: Partial<ApiListItemResolve>) {
		if ('mentions' in json) this.mentions = json.mentions;
		if ('createdByWebhookId' in json) this.createdByWebhookId = json.createdByWebhookId;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
		if ('updatedBy' in json) this.updatedBy = json.updatedBy;
		if ('parentListItemId' in json) this.parentListItemId = json.parentListItemId;
		if ('completedAt' in json) this.completedAt = DateParse(json.completedAt);
		if ('completedBy' in json) this.completedBy = json.completedBy;
		if ('note' in json) this.note = json.note;
	}
}
