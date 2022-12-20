import { ApiServerChannel, ApiChannelType } from '@guildest/api-typings';
import { Collection } from '@guildest/collection';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';
import { Message } from './messages';
import { ForumTopic } from './forums';
import { ListItem } from './listItems';
import { Doc } from './docs';
import { CalendarEvent } from './calendarEvents';
import { Webhook } from './webhooks';
import { Server } from './servers';

/** Channel Types for Guildest Client and for handlers for REST and Websocket */
export { ApiChannelType as ChannelTypes } from '@guildest/api-typings';

/** Channel that Support Content Payload Messages like content and Embed in Guilded for Resolve */
export type ChatSupportedChannel = ChatChannel | AnnouncementChannel;

/** Channel that Support Webhooks Modifications and Generators with REST API on Guilded. */
export type WebhookSupportedChannel = ChatChannel | ListChannel;

/**
 * @class Channel Class Represents the Interfaces of Channels Models in Guilded API in Server.
 */
export class Channel extends Base<ApiServerChannel> {
	/** Channel Type of an Channel in a Server for Categorizing Channel */
	type: ApiChannelType | 'category';
	/** Name of the Channel in the Server. */
	name: string;
	/** Channel Topic as headlined string in the Channel/ */
	topic?: string;
	/** Creation of the Channel in timestamp (ms) Value. */
	createdAt: number;
	/** Represents the Channel Created By User Id in the Guilded. */
	createdById: string;
	/** Represents the Server Id of the Channel in Guilded. */
	serverId: string;
	/** Group Id in the Server where the Channel belongs to */
	groupId: string;
	/** last Updated Timestamp in number (ms) of the Channel. */
	updatedAt?: number;
	/** Parent or Main / Base Channel Id of the Thread in Guilded. */
	parentId?: string;
	/** Category Id of the Channel that belongs to in Guilded.  */
	categoryId?: number;
	/** If the Channel is Public for everyone or not in Boolean. */
	isPublic?: boolean;
	/** Thread Channel is archived By User Id in Guilded. */
	archivedById?: string;
	/** Thread Channel is archived Timestamp (ms) in number in Guilded. */
	archivedAt?: string;

	/**
	 * Represents the Channel Class of the API Channel on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example channel = new Channel(client,data)
	 */
	constructor(client: Client, json: ApiServerChannel) {
		super(client, json);
		this.type = json.type;
		this.name = json.name;
		this.createdAt = Date.parse(json.createdAt);
		this.createdById = json.createdBy;
		this.serverId = json.serverId;
		this.groupId = json.groupId;

		this._update(json);
	}

	/** Server of the Channel that belongs to in Guilded. */
	get server(): Server | undefined {
		return this.client.getServer(this.serverId);
	}

	/**
	 * @param json Partial JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @returns void after updating the class instance
	 */
	_update(json: Partial<ApiServerChannel>) {
		if ('topic' in json) this.topic = json.topic;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
		if ('parentId' in json) this.parentId = json.parentId;
		if ('categoryId' in json) this.categoryId = json.categoryId;
		if ('isPublic' in json) this.isPublic = json.isPublic;
		if ('archivedBy' in json) this.archivedById = json.archivedBy;
		if ('archivedAt' in json) this.archivedAt = json.archivedAt;
	}
}

/**
 * @class CategoryChannel is the Main Channel that holds other regular or exception channels across the Server and Groups
 */
export class CategoryChannel extends Channel {
	/** Collection of Channels under the Category Channel on Guilded. */
	channels = new Collection<string, Channel>();

	/**
	 * Represents the Category Channel from the Guilded.
	 * @param client The Guildest Client Instance
	 * @param json The API Json / Object Value from the Ws or REST
	 */
	constructor(client: Client, json: ApiServerChannel) {
		super(client, json);
		this.type = 'category';
	}
}

/**
 * @class Announcement is the Announcing Content \ Embed across the Server and Groups
 */
export class AnnouncementChannel extends Channel {
	/** Collection of the Messages in Announcement Channel on Guilded. */
	messages = new Collection<string, Message>();

	/**
	 * Represents the Announcement Channel from the Guilded.
	 * @param client The Guildest Client Instance
	 * @param json The API Json / Object Value from the Ws or REST
	 */
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Announcement });
	}
}

/**
 * @class Chatting / Text Channel is the Chatting with Content \ Embed across the Server and Groups
 */
export class ChatChannel extends Channel {
	/** Collection of the Messages in Chat Channel on Guilded. */
	messages = new Collection<string, Message>();

	/**
	 * Represents the Chat Channel from the Guilded.
	 * @param client The Guildest Client Instance
	 * @param json The API Json / Object Value from the Ws or REST
	 */
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Chat });
	}

	/** Represents the Channel Webhooks */
	get webhooks(): Collection<string, Webhook> | undefined {
		if (!this.server) return undefined;
		return this.server.webhooks.filter((webhook) => webhook.channelId === this.id);
	}
}

/**
 * @class Forum Channel for the Feedback or Forum Topics.
 */
export class ForumChannel extends Channel {
	/** Collection of the forum Topics in Forum Channel on Guilded. */
	forumTopics = new Collection<string, ForumTopic>();

	/**
	 * Represents the Forum Channel from the Guilded.
	 * @param client The Guildest Client Instance
	 * @param json The API Json / Object Value from the Ws or REST
	 */
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Forums });
	}
}

/**
 * @class List Channel for the Lisitng of Items
 */
export class ListChannel extends Channel {
	/** Collection of the List Items in Forum Channel on Guilded. */
	items = new Collection<string, ListItem>();

	/**
	 * Represents the List Channel from the Guilded.
	 * @param client The Guildest Client Instance
	 * @param json The API Json / Object Value from the Ws or REST
	 */
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.ListItem });
	}

	/** Represents the Channel Webhooks */
	get webhooks(): Collection<string, Webhook> | undefined {
		if (!this.server) return undefined;
		return this.server.webhooks.filter((webhook) => webhook.channelId === this.id);
	}
}

/**
 * @class Doc Channel for the Docs
 */
export class DocChannel extends Channel {
	/** Collection of the Docs in Forum Channel on Guilded. */
	docs = new Collection<string, Doc>();

	/**
	 * Represents the Doc Channel from the Guilded.
	 * @param client The Guildest Client Instance
	 * @param json The API Json / Object Value from the Ws or REST
	 */
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Docs });
	}
}

/**
 * @class Calendar Event Channel for the Docs
 */
export class CalendarEventChannel extends Channel {
	/** Collection of the Calendar Events in CalendarEvent Channel on Guilded. */
	calendarEvents = new Collection<string, CalendarEvent>();

	/**
	 * Represents the Calendar Event Channel from the Guilded.
	 * @param client The Guildest Client Instance
	 * @param json The API Json / Object Value from the Ws or REST
	 */
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Calendar });
	}
}

/**
 * @class Media Supported Channel for the Docs
 */
export class MediaChannel extends Channel {
	/**
	 * Represents the Media Supported Channel from the Guilded.
	 * @param client The Guildest Client Instance
	 * @param json The API Json / Object Value from the Ws or REST
	 */
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Media });
	}
}

/**
 * @class Voice Supported Channel for the Docs
 */
export class VoiceChannel extends Channel {
	/**
	 * Represents the Voice Supported Channel from the Guilded.
	 * @param client The Guildest Client Instance
	 * @param json The API Json / Object Value from the Ws or REST
	 */
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Voice });
	}
}

/**
 * @class Stream Supported Channel for the Docs
 */
export class StreamChannel extends Channel {
	/**
	 * Represents the Stream Supported Channel from the Guilded.
	 * @param client The Guildest Client Instance
	 * @param json The API Json / Object Value from the Ws or REST
	 */
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Stream });
	}
}

/**
 * @class Scheduling Supported Channel for the Docs
 */
export class SchedulingChannel extends Channel {
	/**
	 * Represents the Scheduling Supported Channel from the Guilded.
	 * @param client The Guildest Client Instance
	 * @param json The API Json / Object Value from the Ws or REST
	 */
	constructor(client: Client, json: ApiServerChannel) {
		super(client, { ...json, type: ApiChannelType.Scheduling });
	}
}
