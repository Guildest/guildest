import { ApiBaseMentions, ApiListItemNoteResolve, ApiListItemResolve } from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';

/**
 * @class List Item Class Represents the Interfaces of List Item Model in Guilded API in Server.
 */
export class ListItem extends Base<ApiListItemResolve> {
	/** Server Id of the List Item on Guilded. */
	serverId: string;
	/** Channel Id of the List Item on Guilded. */
	channelId: string;
	/** Message value of the List Item on Guilded. */
	message: string;
	/** Represents the Created Timestamp (ms) of the List Item on Guilded API. */
	createdAt: number;
	/** Represents the Created By User Id of the List Item on Guilded API. */
	createdById: string;
	/** Represents the mentions of the List Item on Guilded API. */
	mentions?: ApiBaseMentions;
	/** Represents the Webhook Id if it is created by Webhook on Guilded API. */
	createdByWebhookId?: string;
	/** Represents the Last Updated Timestamp (ms) of the List Item on Guilded API. */
	updatedAt?: number;
	/** Represents the Last Updated By User Id on Guilded API. */
	updatedById?: string;
	/** Represents the Parent List Id on Guilded API. */
	parentListItemId?: string;
	/** Represents the Completed Timestamp (ms) of the List Item on Guilded API. */
	completedAt?: number;
	/** Represents the Completed By User Id of the List Item on Guilded API. */
	completedById?: string;
	/** Represents the List Item Note of the List Item on Guilded API. */
	note?: ApiListItemNoteResolve;

	/**
	 * Represents the List Item Class of the model on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example listItem = new ListItem(client,data)
	 */
	constructor(client: Client, json: ApiListItemResolve) {
		super(client, json);
		this.serverId = json.serverId;
		this.channelId = json.channelId;
		this.message = json.message;
		this.createdAt = Date.parse(json.createdAt);
		this.createdById = json.createdBy;

		this._update(json);
	}

	/**
	 * Update function for Updating properties with changed data
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	_update(json: Partial<ApiListItemResolve>) {
		if ('mentions' in json) this.mentions = json.mentions;
		if ('createdByWebhookId' in json) this.createdByWebhookId = json.createdByWebhookId;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
		if ('updatedBy' in json) this.updatedById = json.updatedBy;
		if ('parentListItemId' in json) this.parentListItemId = json.parentListItemId;
		if ('completedAt' in json) this.completedAt = DateParse(json.completedAt);
		if ('completedBy' in json) this.completedById = json.completedBy;
		if ('note' in json) this.note = json.note;
	}
}
