import { ApiBaseClientUser } from './classes/base';
import {
	eventBotServerMembershipCreated,
	eventBotServerMembershipDeleted,
	eventCalendarEventCreated,
	eventCalendarEventDeleted,
	eventCalendarEventRsvpDeleted,
	eventCalendarEventRsvpManyUpdated,
	eventCalendarEventRsvpUpdated,
	eventCalendarEventUpdated,
	eventChannelMessageReactionCreated,
	eventChannelMessageReactionDeleted,
	eventChatMessageCreated,
	eventChatMessageDeleted,
	eventChatMessageUpdated,
	eventDocCreated,
	eventDocDeleted,
	eventDocUpdated,
	eventForumTopicCreated,
	eventForumTopicDeleted,
	eventForumTopicLocked,
	eventForumTopicPinned,
	eventForumTopicUnLocked,
	eventForumTopicUnPinned,
	eventForumTopicUpdated,
	eventListItemCompleted,
	eventListItemCreated,
	eventListItemDeleted,
	eventListItemUnCompleted,
	eventListItemUpdated,
	eventServerChannelCreated,
	eventServerChannelDeleted,
	eventServerChannelUpdated,
	eventServerMemberBanned,
	eventServerMemberJoined,
	eventServerMemberRemoved,
	eventServerMemberUnBanned,
	eventServerMemberUpdated,
	eventServerRolesUpdated,
	eventServerWebhookCreated,
	eventServerWebhookUpdated,
} from './classes/events';

/** The ready payload of the websocket. */
export interface wsReadyPayload {
	/** The last message ID. */
	lastMessageId: string;
	/** The client user. */
	user: ApiBaseClientUser;
	/** The ping interval. */
	heartbeatIntervalMs: number;
}

export enum wsOpGatawayCode {
	/** The event operation code. */
	Event,
	/** The ready operation code. */
	Ready,
	/** The resume operation code. */
	Resume,
}

export interface wsMessagePayload {
	/** The op code. */
	op: wsOpGatawayCode;
	/** The name of the event. */
	t?: string;
	/** The data of the event. */
	d?: any;
	/** The message ID. */
	s?: string;
}

/**
 * The Guilded WebSocket API events.
 * @see https://www.guilded.gg/docs/api/websockets
 */
export interface wsEvents {
	BotServerMembershipCreated: eventBotServerMembershipCreated;
	BotServerMembershipDeleted: eventBotServerMembershipDeleted;
	ChatMessageCreated: eventChatMessageCreated;
	ChatMessageUpdated: eventChatMessageUpdated;
	ChatMessageDeleted: eventChatMessageDeleted;
	ServerMemberJoined: eventServerMemberJoined;
	ServerMemberRemoved: eventServerMemberRemoved;
	ServerMemberBanned: eventServerMemberBanned;
	ServerMemberUnbanned: eventServerMemberUnBanned;
	ServerMemberUpdated: eventServerMemberUpdated;
	ServerRolesUpdated: eventServerRolesUpdated;
	ServerChannelCreated: eventServerChannelCreated;
	ServerChannelUpdated: eventServerChannelUpdated;
	ServerChannelDeleted: eventServerChannelDeleted;
	ServerWebhookCreated: eventServerWebhookCreated;
	ServerWebhookUpdated: eventServerWebhookUpdated;
	DocCreated: eventDocCreated;
	DocUpdated: eventDocUpdated;
	DocDeleted: eventDocDeleted;
	CalendarEventCreated: eventCalendarEventCreated;
	CalendarEventUpdated: eventCalendarEventUpdated;
	CalendarEventDeleted: eventCalendarEventDeleted;
	ForumTopicCreated: eventForumTopicCreated;
	ForumTopicUpdated: eventForumTopicUpdated;
	ForumTopicDeleted: eventForumTopicDeleted;
	ForumTopicPinned: eventForumTopicPinned;
	ForumTopicUnpinned: eventForumTopicUnPinned;
	ForumTopicLocked: eventForumTopicLocked;
	ForumTopicUnlocked: eventForumTopicUnLocked;
	CalendarEventRsvpUpdated: eventCalendarEventRsvpUpdated;
	CalendarEventRsvpManyUpdated: eventCalendarEventRsvpManyUpdated;
	CalendarEventRsvpDeleted: eventCalendarEventRsvpDeleted;
	ListItemCreated: eventListItemCreated;
	ListItemUpdated: eventListItemUpdated;
	ListItemDeleted: eventListItemDeleted;
	ListItemCompleted: eventListItemCompleted;
	ListItemUncompleted: eventListItemUnCompleted;
	ChannelMessageReactionCreated: eventChannelMessageReactionCreated;
	ChannelMessageReactionDeleted: eventChannelMessageReactionDeleted;
}
