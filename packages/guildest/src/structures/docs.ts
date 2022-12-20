import { ApiDocs, ApiBaseMentions } from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';
import { Server } from './servers';
import { Channel } from './channels';

/**
 * @class Doc Class Represents the Interfaces of Doc Model in Guilded API in Server.
 */
export class Doc extends Base<ApiDocs> {
	/** Represents the Server Id on Guilded API. */
	serverId: string;
	/** Represents the Channel Id of the Doc on Guilded API. */
	channelId: string;
	/** Represents the Title of the Doc on Guilded API. */
	title?: string;
	/** Represents the content of the Doc on Guilded API. */
	content?: string;
	/** Represents the mentions of the Doc on Guilded API. */
	mentions?: ApiBaseMentions;
	/** Represents the Created Timestamp (ms) of the Doc on Guilded API. */
	createdAt: number;
	/** Represents the Created By User Id of the Doc on Guilded API. */
	createdById: string;
	/** Represents the Updated Timestamp (ms) of the Doc on Guilded API. */
	updatedAt?: number;
	/** Represents the Updated By User Id of the Doc on Guilded API. */
	updatedById?: string;

	/**
	 * Represents the Doc Class of the model on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example doc = new Doc(client,data)
	 */
	constructor(client: Client, json: ApiDocs) {
		super(client, Object.assign({}, json, { id: json.id.toString() }));
		this.serverId = json.serverId;
		this.channelId = json.channelId;
		this.createdAt = Date.parse(json.createdAt);
		this.createdById = json.createdBy;

		this._update(json);
	}

	/** Server model realted to the Doc in Guilded. */
	get server(): Server | undefined {
		return this.client.getServer(this.serverId);
	}

	/** channel model realted to the Doc in Guilded. */
	get channel(): Channel | undefined {
		if (!this.channelId) return undefined;
		return this.client.getChannel(this.channelId);
	}

	/**
	 * Update function for Updating properties with changed data
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	_update(json: Partial<ApiDocs>) {
		if ('mentions' in json) this.mentions = json.mentions;
		if ('title' in json) this.title = json.title;
		if ('content' in json) this.content = json.content;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
		if ('updatedBy' in json) this.updatedById = json.updatedBy;
	}
}
