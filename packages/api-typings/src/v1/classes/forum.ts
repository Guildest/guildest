import { ApiBase, ApiBaseMentions } from './base';

/**
 * Represents Server Forums Topic Summary on Guilded.
 * @see https://www.guilded.gg/docs/api/forums/ForumTopicSummary
 */
export interface ApiForumTopicSummary extends ApiBase {
	/* Id of the Forum of the Server on Guilded. */
	id: string;
	/* Server Id of the Forum of the Server on Guilded. */
	serverId: string;
	/* Channel Id of the Forum of the Server on Guilded. */
	channelId: string;
	/* Title of the Forum of the Server on Guilded. */
	title: string;
	/* Creation Date/Time ISO-String of the Forum of the Server on Guilded. */
	createdAt: string;
	/* User Id of the Creating User of the Forum of the Server on Guilded. */
	createdBy: string;
	/* Webhook Id of the Webhook on Creating the Forum of the Server on Guilded. */
	createdByWebhookId?: string;
	/* Last Update Date/Time ISO-String of the Forum of the Server on Guilded. */
	updatedAt?: string;
	/* Last Bumped Date/Time ISO-String of the Forum of the Server on Guilded. */
	bumpedAt?: string;
	/* If Pinned Forum Topic in the Server on Guilded. */
	isPinned?: boolean;
	/* If Locked Forum Topic in the Server on Guilded. */
	isLocked?: boolean;
}

/**
 * Represents Server Forums Topic on Guilded.
 * @see https://www.guilded.gg/docs/api/forums/ForumTopic
 */
export interface ApiForumTopic extends ApiForumTopicSummary {
	/* Represent Forum Topic Content on Guilded. */
	content: string;
	/* Represent Forum Topic Mentions on Guilded. */
	mentions?: ApiBaseMentions;
}

/**
 * Represents Server Forums Topic Create/Update Payload on Guilded.
 * @see https://www.guilded.gg/docs/api/forums/ForumTopicCreate
 */
export interface ApiForumTopicPayload {
	/* Represent Forum Topic Title on Guilded. */
	title: string;
	/* Represent Forum Topic Content on Guilded. */
	content: string;
}