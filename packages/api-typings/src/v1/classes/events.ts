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

export interface eventChatMessageCreate extends ApiBaseServerEvent {
	message: ApiMessage;
}

export interface eventChatMessageUpdated extends eventChatMessageCreate {}

export interface eventChatMessageDeleted extends ApiBaseServerEvent {
	message: wsMessageDelete;
}

export interface eventTeamMemberJoined extends ApiBaseServerEvent {
	member: ApiServerMember;
}

export interface eventTeamMemberRemoved extends ApiBaseServerEvent {
	userId: string;
	isKick?: boolean;
	isBan?: boolean;
}

export interface eventTeamMemberBanned extends ApiBaseServerEvent {
	serverMemberBan: ApiServerMemberBan;
}

export interface eventTeamMemberUnBanned extends ApiBaseServerEvent {
	serverMemberBan: ApiServerMemberBan;
}

export interface eventTeamMemberUpdated extends ApiBaseServerEvent {
	userInfo: ApiBaseUserInfo;
}

export interface eventTeamRolesUpdated extends ApiBaseServerEvent {
	memberRoleIds: Array<ApiBaseMemberRoleIds>;
}

export interface eventTeamChannelCreated extends ApiBaseServerEvent {
	channel: ApiServerChannel;
}

export interface eventTeamChannelUpdated extends ApiBaseServerEvent {
	channel: ApiServerChannel;
}

export interface eventTeamChannelDeleted extends ApiBaseServerEvent {
	channel: ApiServerChannel;
}

export interface eventTeamWebhookCreated extends ApiBaseServerEvent {
	webhook: ApiWebhook;
}

export interface eventTeamWebhookUpdated extends ApiBaseServerEvent {
	webhook: ApiWebhook;
}

export interface eventDocCreated extends ApiBaseServerEvent {
	doc: ApiDocs;
}

export interface eventDocUpdated extends ApiBaseServerEvent {
	doc: ApiDocs;
}

export interface eventDocDeleted extends ApiBaseServerEvent {
	doc: ApiDocs;
}

export interface eventCalenderEventCreated extends ApiBaseServerEvent {
	calenderEvent: ApiCalenderEvent;
}

export interface eventCalenderEventUpdated extends ApiBaseServerEvent {
	calenderEvent: ApiCalenderEvent;
}

export interface eventCalenderEventDeleted extends ApiBaseServerEvent {
	calenderEvent: ApiCalenderEvent;
}

export interface eventForumTopicCreated extends ApiBaseServerEvent {
	forumTopic: ApiForumTopic;
}

export interface eventForumTopicUpdated extends ApiBaseServerEvent {
	forumTopic: ApiForumTopic;
}

export interface eventForumTopicDeleted extends ApiBaseServerEvent {
	forumTopic: ApiForumTopic;
}

export interface eventForumTopicPinned extends ApiBaseServerEvent {
	forumTopic: ApiForumTopic;
}

export interface eventForumTopicUnPinned extends ApiBaseServerEvent {
	forumTopic: ApiForumTopic;
}

export interface eventForumTopicLocked extends ApiBaseServerEvent {
	forumTopic: ApiForumTopic;
}

export interface eventForumTopicUnLocked extends ApiBaseServerEvent {
	forumTopic: ApiForumTopic;
}

export interface eventCalenderEventRsvpUpdated extends ApiBaseServerEvent {
	calendarEventRsvp: ApiCalenderEventRsvp;
}

export interface eventCalenderEventRsvpManyUpdated extends ApiBaseServerEvent {
	calendarEventRsvp: Array<ApiCalenderEventRsvp>;
}

export interface eventCalenderEventRsvpDeleted extends ApiBaseServerEvent {
	calendarEventRsvp: ApiCalenderEventRsvp;
}

export interface eventListItemCreated extends ApiBaseServerEvent {
	listItem: ApiListItem;
}

export interface eventListItemUpdated extends ApiBaseServerEvent {
	listItem: ApiListItem;
}

export interface eventListItemCompleted extends ApiBaseServerEvent {
	listItem: ApiListItem;
}

export interface eventListItemDeleted extends ApiBaseServerEvent {
	listItem: ApiListItem;
}

export interface eventListItemUnCompleted extends ApiBaseServerEvent {
	listItem: ApiListItem;
}

export interface eventChannelMessageReactionCreated extends ApiBaseServerEvent {
	reaction: ApiBaseReaction;
}

export interface eventChannelMessageReactionDeleted extends ApiBaseServerEvent {
	reaction: ApiBaseReaction;
}
