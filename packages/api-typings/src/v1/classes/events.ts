import {
	ApiBaseServerEvent,
	ApiBase,
	ApiBaseUserInfo,
	ApiBaseMemberRoleIds,
	ApiBaseReaction,
} from './base';
import { ApiCalenderEvent, ApiCalenderEventRsvp } from './calenderEvents';
import { ApiServerChannel } from './channel';
import { ApiMessage } from './chat';
import { ApiDocs } from './docs';
import { ApiForumTopic } from './forum';
import { ApiListItem } from './list';
import { ApiServerMember, ApiServerMemberBan } from './server';
import { ApiWebhook } from './webhook';

/**
 * Represents Message Delete Websocket Metadata/Response from Guilded.
 * @see https://www.guilded.gg/docs/api/websockets/ChatMessageDeleted
 */
export interface wsMessageDelete extends ApiBase {
	/* The Id of the Chat Message in string. */
	id: string;
	/* The Server Id of the Server where Chat Message is present in string. */
	serverId?: string;
	/* The Channel Id of the Server where Chat Message is present in string. */
	channelId: string;
	/* Represent the Deleted-at Data/Time in ISO-String Value. */
	deletedAt: string;
	/* Represent isPrivate if Message is Privately Send. */
	isPrivate?: boolean;
}

/**
 * Represents Event When Message is Created.
 * @see https://www.guilded.gg/docs/api/websockets/ChatMessageCreated
 */
export interface eventChatMessageCreated extends ApiBaseServerEvent {
	/** Message Data/Object along with the Event Trigger */
	message: ApiMessage;
}

/**
 * Represents Event When Message is Editted/Updated.
 * @see https://www.guilded.gg/docs/api/websockets/ChatMessageUpdated
 */
export interface eventChatMessageUpdated extends ApiBaseServerEvent {
	/** Message Data/Object along with the Event Trigger */
	message: ApiMessage;
}

/**
 * Represents Event When Message is Deleted.
 * @see https://www.guilded.gg/docs/api/websockets/ChatMessageDeleted
 */
export interface eventChatMessageDeleted extends ApiBaseServerEvent {
	/** Message Remaining Data/Object along with the Event Trigger */
	message: wsMessageDelete;
}

/**
 * Represents Event When Team Member Join.
 * @see https://www.guilded.gg/docs/api/websockets/TeamMemberJoined
 */
export interface eventTeamMemberJoined extends ApiBaseServerEvent {
	/** Team Member Data/Object along with the Event Trigger */
	member: ApiServerMember;
}

/**
 * Represents Event When Team Member Removed/Left.
 * @see https://www.guilded.gg/docs/api/websockets/TeamMemberRemoved
 */
export interface eventTeamMemberRemoved extends ApiBaseServerEvent {
	/** User Id of the Team Member Removed along with the Event Trigger */
	userId: string;
	/** If its got Kicked whemn along side of Member Removed */
	isKick?: boolean;
	/** If its User got Banned along side of Member Removed */
	isBan?: boolean;
}

/**
 * Represents Event When Team Member Banned.
 * @see https://www.guilded.gg/docs/api/websockets/TeamMemberBanned
 */
export interface eventTeamMemberBanned extends ApiBaseServerEvent {
	/** Server Member Ban Information */
	serverMemberBan: ApiServerMemberBan;
}

/**
 * Represents Event When Team Member Unbanned.
 * @see https://www.guilded.gg/docs/api/websockets/TeamMemberUnBanned
 */
export interface eventTeamMemberUnBanned extends ApiBaseServerEvent {
	/** Server Member Ban Information */
	serverMemberBan: ApiServerMemberBan;
}

/**
 * Represents Event When Team Member Updated.
 * @see https://www.guilded.gg/docs/api/websockets/TeamMemberUpdated
 */
export interface eventTeamMemberUpdated extends ApiBaseServerEvent {
	/** Base User Info on Event Triger. */
	userInfo: ApiBaseUserInfo;
}

/**
 * Represents Event When Array of Team Member Roles Updated.
 * @see https://www.guilded.gg/docs/api/websockets/TeamRolesUpdated
 */
export interface eventTeamRolesUpdated extends ApiBaseServerEvent {
	/** Represents the Array of Member Role Ids associated with Member */
	memberRoleIds: Array<ApiBaseMemberRoleIds>;
}

/**
 * Represents Event When Server Channel has been Created in Server.
 * @see https://www.guilded.gg/docs/api/websockets/TeamChannelCreated
 */
export interface eventTeamChannelCreated extends ApiBaseServerEvent {
	/** Server Channel along side with the Event Trigger. */
	channel: ApiServerChannel;
}

/**
 * Represents Event When Server Channel has been Editted/Updated in Server.
 * @see https://www.guilded.gg/docs/api/websockets/TeamChannelUpdated
 */
export interface eventTeamChannelUpdated extends ApiBaseServerEvent {
	/** Server Channel along side with the Event Trigger. */
	channel: ApiServerChannel;
}

/**
 * Represents Event When Server Channel has been Deleted in Server.
 * @see https://www.guilded.gg/docs/api/websockets/TeamChannelDeleted
 */
export interface eventTeamChannelDeleted extends ApiBaseServerEvent {
	/** Server Channel along side with the Event Trigger. */
	channel: ApiServerChannel;
}

/**
 * Represents Event When Webhook has been Created in Server.
 * @see https://www.guilded.gg/docs/api/websockets/TeamWebhookCreated
 */
export interface eventTeamWebhookCreated extends ApiBaseServerEvent {
	/** Webhook Data/Object on Server. */
	webhook: ApiWebhook;
}

/**
 * Represents Event When Webhook has been Updated in Server.
 * @see https://www.guilded.gg/docs/api/websockets/TeamWebhookUpdated
 */
export interface eventTeamWebhookUpdated extends ApiBaseServerEvent {
	/** Webhook Data/Object on Server. */
	webhook: ApiWebhook;
}

/**
 * Represents Event When Docs has been Created in Server.
 * @see https://www.guilded.gg/docs/api/websockets/DocCreated
 */
export interface eventDocCreated extends ApiBaseServerEvent {
	/** Represent the Docs Data/Object along with Event Trigger. */
	doc: ApiDocs;
}

/**
 * Represents Event When Docs has been Updated in Server.
 * @see https://www.guilded.gg/docs/api/websockets/DocUpdated
 */
export interface eventDocUpdated extends ApiBaseServerEvent {
	/** Represent the Docs Data/Object along with Event Trigger. */
	doc: ApiDocs;
}

/**
 * Represents Event When Docs has been Deleted in Server.
 * @see https://www.guilded.gg/docs/api/websockets/DocDeleted
 */
export interface eventDocDeleted extends ApiBaseServerEvent {
	/** Represent the Docs Data/Object along with Event Trigger. */
	doc: ApiDocs;
}

/**
 * Represents Event When Calender Event has been Created in Server.
 * @see https://www.guilded.gg/docs/api/websockets/CalenderEventCreated
 */
export interface eventCalenderEventCreated extends ApiBaseServerEvent {
	/** Represent the Calender Event Data/Object/Model along with Event Trigger. */
	calenderEvent: ApiCalenderEvent;
}

/**
 * Represents Event When Calender Event has been Editted/Updated in Server.
 * @see https://www.guilded.gg/docs/api/websockets/CalenderEventUpdated
 */
export interface eventCalenderEventUpdated extends ApiBaseServerEvent {
	/** Represent the Calender Event Data/Object/Model along with Event Trigger. */
	calenderEvent: ApiCalenderEvent;
}

/**
 * Represents Event When Calender Event has been Deleted in Server.
 * @see https://www.guilded.gg/docs/api/websockets/CalenderEventDeleted
 */
export interface eventCalenderEventDeleted extends ApiBaseServerEvent {
	/** Represent the Calender Event Data/Object/Model along with Event Trigger. */
	calenderEvent: ApiCalenderEvent;
}

/**
 * Represents Event When Forum Topic has been Created in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ForumTopicCreated
 */
export interface eventForumTopicCreated extends ApiBaseServerEvent {
	/** Represent the Forum Topic Object/Data/Model along with Event Trigger. */
	forumTopic: ApiForumTopic;
}

/**
 * Represents Event When Forum Topic has been Editted/Updated in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ForumTopicUpdated
 */
export interface eventForumTopicUpdated extends ApiBaseServerEvent {
	/** Represent the Forum Topic Object/Data/Model along with Event Trigger. */
	forumTopic: ApiForumTopic;
}

/**
 * Represents Event When Forum Topic has been Deleted in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ForumTopicDeleted
 */
export interface eventForumTopicDeleted extends ApiBaseServerEvent {
	/** Represent the Forum Topic Object/Data/Model along with Event Trigger. */
	forumTopic: ApiForumTopic;
}

/**
 * Represents Event When Forum Topic has been Pinned in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ForumTopicPinned
 */
export interface eventForumTopicPinned extends ApiBaseServerEvent {
	/** Represent the Forum Topic Object/Data/Model along with Event Trigger. */
	forumTopic: ApiForumTopic;
}

/**
 * Represents Event When Forum Topic has been Unpinned in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ForumTopicUnPinned
 */
export interface eventForumTopicUnPinned extends ApiBaseServerEvent {
	/** Represent the Forum Topic Object/Data/Model along with Event Trigger. */
	forumTopic: ApiForumTopic;
}

/**
 * Represents Event When Forum Topic has been Locked in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ForumTopicUnPinned
 */
export interface eventForumTopicLocked extends ApiBaseServerEvent {
	/** Represent the Forum Topic Object/Data/Model along with Event Trigger. */
	forumTopic: ApiForumTopic;
}

/**
 * Represents Event When Forum Topic has been Un-Locked in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ForumTopicUnPinned
 */
export interface eventForumTopicUnLocked extends ApiBaseServerEvent {
	/** Represent the Forum Topic Object/Data/Model along with Event Trigger. */
	forumTopic: ApiForumTopic;
}

/**
 * Represents Event When Calender Event Rsvp has been Updated in Server.
 * @see https://www.guilded.gg/docs/api/websockets/CalenderEventRsvpUpdated
 */
export interface eventCalenderEventRsvpUpdated extends ApiBaseServerEvent {
	/** Represent the Calender Event Rsvp Object/Data/Model along with Event Trigger. */
	calendarEventRsvp: ApiCalenderEventRsvp;
}

/**
 * Represents Event When Many Calender Event Rsvp has been Updated in Server.
 * @see https://www.guilded.gg/docs/api/websockets/CalenderEventRsvpManyUpdated
 */
export interface eventCalenderEventRsvpManyUpdated extends ApiBaseServerEvent {
	/** Represent the Array of Calender Event Rsvp Object/Data/Model along with Event Trigger. */
	calendarEventRsvp: Array<ApiCalenderEventRsvp>;
}

/**
 * Represents Event When Calender Event Rsvp has been Deleted in Server.
 * @see https://www.guilded.gg/docs/api/websockets/CalenderEventRsvpDeleted
 */
export interface eventCalenderEventRsvpDeleted extends ApiBaseServerEvent {
	/** Represent the Calender Event Rsvp Object/Data/Model along with Event Trigger. */
	calendarEventRsvp: ApiCalenderEventRsvp;
}

/**
 * Represents Event When List Item has been Created in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ListItemCreated
 */
export interface eventListItemCreated extends ApiBaseServerEvent {
	/** Represent the List Item Object/Model along the Event Trigger. */
	listItem: ApiListItem;
}

/**
 * Represents Event When List Item has been Updated in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ListItemUpdated
 */
export interface eventListItemUpdated extends ApiBaseServerEvent {
	/** Represent the List Item Object/Model along the Event Trigger. */
	listItem: ApiListItem;
}

/**
 * Represents Event When List Item has been Completed in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ListItemCompleted
 */
export interface eventListItemCompleted extends ApiBaseServerEvent {
	/** Represent the List Item Object/Model along the Event Trigger. */
	listItem: ApiListItem;
}

/**
 * Represents Event When List Item has been Deleted in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ListItemDeleted
 */
export interface eventListItemDeleted extends ApiBaseServerEvent {
	/** Represent the List Item Object/Model along the Event Trigger. */
	listItem: ApiListItem;
}

/**
 * Represents Event When List Item has been Un-Completed in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ListItemUnCompleted
 */
export interface eventListItemUnCompleted extends ApiBaseServerEvent {
	/** Represent the List Item Object/Model along the Event Trigger. */
	listItem: ApiListItem;
}

/**
 * Represents Event When Channel Message Reaction has been Created in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ChannelMessageReactionCreated
 */
export interface eventChannelMessageReactionCreated extends ApiBaseServerEvent {
	/** Represent the Message Reaction of the Message on Event Trigger. */
	reaction: ApiBaseReaction;
}

/**
 * Represents Event When Channel Message Reaction has been Deleted in Server.
 * @see https://www.guilded.gg/docs/api/websockets/ChannelMessageReactionDeleted
 */
export interface eventChannelMessageReactionDeleted extends ApiBaseServerEvent {
	/** Represent the Message Reaction of the Message on Event Trigger. */
	reaction: ApiBaseReaction;
}
