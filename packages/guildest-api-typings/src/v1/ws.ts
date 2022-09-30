import { ApiBaseClientUser } from './classes/base';
import {
	eventCalenderEventCreated,
	eventCalenderEventDeleted,
	eventCalenderEventRsvpDeleted,
	eventCalenderEventRsvpManyUpdated,
	eventCalenderEventRsvpUpdated,
	eventCalenderEventUpdated,
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
	eventTeamChannelCreated,
	eventTeamChannelDeleted,
	eventTeamChannelUpdated,
	eventTeamMemberBanned,
	eventTeamMemberJoined,
	eventTeamMemberRemoved,
	eventTeamMemberUnBanned,
	eventTeamMemberUpdated,
	eventTeamRolesUpdated,
	eventTeamWebhookCreated,
	eventTeamWebhookUpdated,
} from './classes/events';

/** The ready payload of the websocket. */
export interface WSReadyPayload {
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
	ChatMessageCreated: eventChatMessageCreated;
	ChatMessageUpdated: eventChatMessageUpdated;
	ChatMessageDeleted: eventChatMessageDeleted;
	TeamMemberJoined: eventTeamMemberJoined;
	TeamMemberRemoved: eventTeamMemberRemoved;
	TeamMemberBanned: eventTeamMemberBanned;
	TeamMemberUnbanned: eventTeamMemberUnBanned;
	TeamMemberUpdated: eventTeamMemberUpdated;
	TeamRolesUpdated: eventTeamRolesUpdated;
	TeamChannelCreated: eventTeamChannelCreated;
	TeamChannelUpdated: eventTeamChannelUpdated;
	TeamChannelDeleted: eventTeamChannelDeleted;
	TeamWebhookCreated: eventTeamWebhookCreated;
	TeamWebhookUpdated: eventTeamWebhookUpdated;
	DocCreated: eventDocCreated;
	DocUpdated: eventDocUpdated;
	DocDeleted: eventDocDeleted;
	CalendarEventCreated: eventCalenderEventCreated;
	CalendarEventUpdated: eventCalenderEventUpdated;
	CalendarEventDeleted: eventCalenderEventDeleted;
	ForumTopicCreated: eventForumTopicCreated;
	ForumTopicUpdated: eventForumTopicUpdated;
	ForumTopicDeleted: eventForumTopicDeleted;
	ForumTopicPinned: eventForumTopicPinned;
	ForumTopicUnpinned: eventForumTopicUnPinned;
	ForumTopicLocked: eventForumTopicLocked;
	ForumTopicUnlocked: eventForumTopicUnLocked;
	CalendarEventRsvpUpdated: eventCalenderEventRsvpUpdated;
	CalendarEventRsvpManyUpdated: eventCalenderEventRsvpManyUpdated;
	CalendarEventRsvpDeleted: eventCalenderEventRsvpDeleted;
	ListItemCreated: eventListItemCreated;
	ListItemUpdated: eventListItemUpdated;
	ListItemDeleted: eventListItemDeleted;
	ListItemCompleted: eventListItemCompleted;
	ListItemUncompleted: eventListItemUnCompleted;
	ChannelMessageReactionCreated: eventChannelMessageReactionCreated;
	ChannelMessageReactionDeleted: eventChannelMessageReactionDeleted;
}
