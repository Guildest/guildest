import { ApiBaseMentions, ApiForumTopicComment, ApiForumTopicResolve } from '@guildest/api-typings';
import { Collection } from '@guildest/collection';
import { DateParse } from '../utils/basicUtils';
import { Base, BaseReaction } from './base';
import { Client } from './client';

/**
 * @class Forum Topic Class Represents the Interfaces of Forum Topic Model in Guilded API in Server.
 */
export class ForumTopic extends Base<ApiForumTopicResolve> {
	/** Server Id of the Forum Topic on Guilded. */
	serverId: string;
	/** Channel Id of the Forum Topic on Guilded. */
	channelId: string;
	/** Title value of the Forum Topic on Guilded. */
	title: string;
	/** Collection of comments of the Forum Topic on Guilded. */
	comments = new Collection<string, ForumTopicComment>();
	/** Array of reactions of the Forum Topic on Guilded. */
	reactions = new Array<BaseReaction>();
	/** Represents the Created Timestamp (ms) of the Forum Topic on Guilded API. */
	createdAt: number;
	/** Represents the Created By User Id of the Forum Topic on Guilded API. */
	createdById: string;
	/** Represents the Webhook Id if it is created by Webhook on Guilded API. */
	createdByWebhookId?: string;
	/** Represents the Last Updated Timestamp (ms) of the Forum Topic on Guilded API. */
	updatedAt?: number;
	/** Represents the Bumped Timestamp (ms) of the Forum Topic on Guilded API. */
	bumpedAt?: number;
	/** Represents the Boolean Value of if pinned of the Forum Topic on Guilded API. */
	isPinned?: boolean;
	/** Represents the Boolean Value of if locked of the Forum Topic on Guilded API. */
	isLocked?: boolean;
	/** Represents the content of the Forum Topic on Guilded API. */
	content?: string;
	/** Represents the mentions of the Forum Topic on Guilded API. */
	mentions?: ApiBaseMentions;

	/**
	 * Represents the Forum Topic Class of the model on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example forumTopic = new ForumTopic(client,data)
	 */
	constructor(client: Client, json: ApiForumTopicResolve) {
		super(client, Object.assign({}, json, { id: json.id.toString() }));
		this.serverId = json.serverId;
		this.channelId = json.channelId;
		this.title = json.title;
		this.createdAt = Date.parse(json.createdAt);
		this.createdById = json.createdBy;
	}

	/**
	 * Update function for Updating properties with changed data
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	_update(json: Partial<ApiForumTopicResolve>) {
		if ('createdByWebhookId' in json) this.createdByWebhookId = json.createdByWebhookId;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
		if ('bumpedAt' in json) this.bumpedAt = DateParse(json.bumpedAt);
		if ('isPinned' in json) this.isPinned = json.isPinned;
		if ('isLocked' in json) this.isLocked = json.isLocked;
		if ('content' in json) this.content = json.content;
		if ('mentions' in json) this.mentions = json.mentions;
	}
}

/**
 * @class Forum Topic Comment Class Represents the Interfaces of Forum Topic Comment Model in Guilded API in Server.
 */
export class ForumTopicComment extends Base<ApiForumTopicComment> {
	/** Represents the content of the Forum Topic Comment on Guilded API. */
	content?: string;
	/** Represents the reactions of the Forum Topic Comment on Guilded API. */
	reactions = new Array<BaseReaction>();
	/** Represents the Created Timestamp (ms) of the Forum Topic on Guilded API. */
	createdAt: number;
	/** Represents the Last Updated Timestamp (ms) of the Forum Topic on Guilded API. */
	updatedAt?: number;
	/** Channel Id of the Forum Topic Comment on Guilded. */
	channelId: string;
	/** Forum Topic Id of the Forum Topic Comment on Guilded. */
	forumTopicId: string;
	/** Represents the Created By User Id of the Forum Topic Comment on Guilded API. */
	createdById: string;
	/** Represents the mentions of the Forum Topic on Guilded API. */
	mentions?: ApiBaseMentions;

	/**
	 * Represents the Forum Topic Comment Class of the model on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	constructor(client: Client, json: ApiForumTopicComment) {
		super(client, Object.assign({}, json, { id: json.id.toString() }));
		this.createdAt = Date.parse(json.createdAt);
		this.channelId = json.channelId;
		this.forumTopicId = json.forumTopicId;
		this.createdById = json.createdBy;
		this._update(json);
	}

	/**
	 * Update function for Updating properties with changed data
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	_update(json: Partial<ApiForumTopicComment>) {
		if ('content' in json) this.content = json.content;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
		if ('mentions' in json) this.mentions = json.mentions;
	}
}
