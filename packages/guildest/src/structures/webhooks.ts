import { ApiWebhook } from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';

/**
 * @class Webhook Class Represents the Interfaces of Webhook Model in Guilded API.
 */
export class Webhook extends Base<ApiWebhook> {
	/** Server Id of the Webhook in Guilded. */
	serverId: string;
	/** Channel Id of the Webhook in Guilded. */
	channelId: string;
	/** Name of the Webhook */
	name?: string;
	/** Represents the Created Timestamp (ms) of the Webhook on Guilded API. */
	createdAt: number;
	/** Represents the Created By User Id of the Webhook on Guilded API. */
	createdById: string;
	/** Represents the Deletion Timestamp (ms) of the Webhook on Guilded API. */
	deletedAt?: number;
	/** Secret Webhook Token */
	token?: string;

	/**
	 * Represents the Webhook Class of the model on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example webhook = new Webhook(client,data)
	 */
	constructor(client: Client, json: ApiWebhook) {
		super(client, json);
		this.serverId = json.serverId;
		this.channelId = json.channelId;
		this.createdAt = Date.parse(json.createdAt);
		this.createdById = json.createdBy;

		this._update(json);
	}

	/**
	 * Update function for Updating properties with changed data
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	_update(json: Partial<ApiWebhook>) {
		if ('name' in json) this.name = json.name;
		if ('deletedAt' in json) this.deletedAt = DateParse(json.deletedAt);
		if ('token' in json) this.token = json.token;
	}
}
