import { ApiBase, ApiBaseMentions, ApiBaseReaction } from './base';

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
 * Rresents the Forum Topic Reaction Event Data .
 * @see https://www.guilded.gg/docs/api/websockets/ForumTopicReactionCreated
 * @see https://www.guilded.gg/docs/api/websockets/ForumTopicReactionDeleted
 */
export interface ApiForumTopicReaction extends Exclude<ApiBaseReaction, 'messageId'> {
	/* Forum Topic Id Value of the Related Forum Topic on Guilded.  */
	forumTopicId: string;
}

/**
 * Rresents the Forum Topic Comment Reaction Event Data .
 * @see https://www.guilded.gg/docs/api/websockets/ForumTopicCommentReactionCreated
 * @see https://www.guilded.gg/docs/api/websockets/ForumTopicCommentReactionDeleted
 */
export interface ApiForumTopicCommentReaction extends ApiForumTopicReaction {
	/** Represents the Forum Topic Comment Id on Forum Topic on Guilded. */
	forumTopicCommentId: string;
}

/* Represents the Resolve for Forum Topic for Guilded Packages. */
export type ApiForumTopicResolve = ApiForumTopic | ApiForumTopicSummary;

/**
 * Represents Forums Topic Comment on Guilded.
 * @see https://www.guilded.gg/docs/api/forumComments/ForumTopicComment
 */
export interface ApiForumTopicComment {
	/* Represent Forum Topic Comment Id string on Guilded Server. */
	id: string;
	/* Represent The content of the forum topic comment (min length 1; max length 10000) */
	content: string;
	/* Represents The ISO 8601 timestamp that the forum topic comment was created at */
	createdAt: string;
	/* Represents The ISO 8601 timestamp that the forum topic comment was Last Updated at */
	updatedAt?: string;
	/* Channel Id of the Related Forum Topic of the Server on Guilded. */
	channelId: string;
	/* Represents the Forum Topic id where User Commented on Guilded. */
	forumTopicId: string;
	/* User ID of the Commenter on Forum Topic on Guilded. */
	createdBy: string;
	/* Represent Forum Topic Comment Mentions on Guilded. */
	mentions?: ApiBaseMentions;
}

/**
 * Represents Server Forums Topic Update Payload on Guilded.
 * @see https://www.guilded.gg/docs/api/forums/ForumTopicUpdate
 */
export interface restForumTopicUpdatePayload {
	/* Represent Forum Topic Title on Guilded. */
	title?: string;
	/* Represent Forum Topic Content on Guilded. */
	content?: string;
}

/**
 * Represents Server Forums Topic Create Payload on Guilded.
 * @see https://www.guilded.gg/docs/api/forums/ForumTopicCreate
 */
export interface restForumTopicCreatePayload extends restForumTopicUpdatePayload {
	/* Represent Forum Topic Title on Guilded. */
	title: string;
	/* Represent Forum Topic Content on Guilded. */
	content: string;
}

/**
 * Represents Server Forums Topics Fetch Query on Guilded.
 * @see https://www.guilded.gg/docs/api/forums/ForumTopicReadMany
 */
export interface restForumTopicsQueryParams {
	/* Represent An ISO 8601 timestamp that will be used to filter out results for the current page on Guilded. */
	before?: string;
	/* Represent The max size of the page (default 25; min 1; max 100) on Guilded. */
	limit?: number;
}

/**
 * Represents Server Forums Topic Comment Create Payload on Forum Topic on Guilded.
 * @see https://www.guilded.gg/docs/api/forumComments/ForumTopicCommentCreate
 */
export interface restForumTopicCommentCreatePayload {
	/* Represent Forum Topic Comment Title on Guilded. */
	content: string;
}

/**
 * Represents Server Forums Topic Comment Update Payload on Forum Topic on Guilded.
 * @see https://www.guilded.gg/docs/api/forumComments/ForumTopicCommentUpdate
 */
export interface restForumTopicCommentUpdatePayload {
	/* Represent Forum Topic Comment Title on Guilded. */
	content: string;
}
