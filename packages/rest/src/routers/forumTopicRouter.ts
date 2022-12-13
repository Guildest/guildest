import {
	ApiForumTopic,
	restForumTopicCreatePayload,
	restForumTopicUpdatePayload,
	ApiForumTopicSummary,
	Endpoints,
	restForumTopicsQueryParams,
	ApiForumTopicComment,
	restForumTopicCommentCreatePayload,
	restForumTopicCommentUpdatePayload,
} from '@guildest/api-typings';
import { restManager } from '../restManager';

/**
 * The Forum Topic's Router for the Guilded REST Api.
 * @example new ForumTopicRouter(rest)
 */
export class ForumTopicRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Create Forum Topic on Channel on Guilded REST API Request.
	 * @param channelId The ID of the channel on Guilded.
	 * @param payload New Forum Topic payload on Guilded.
	 * @returns Forum Topic Object from Guilded.
	 * @example ForumTopicRouter.create('abc' , { name: "New Topic!!" })
	 */

	async create(channelId: string, payload: restForumTopicCreatePayload): Promise<ApiForumTopic> {
		return await this.rest
			.post<{ forumTopic: ApiForumTopic }, restForumTopicCreatePayload>(
				Endpoints.forumTopics(channelId),
				payload,
			)
			?.then((R) => R?.forumTopic);
	}

	/**
	 * Fetch Forum Topics or Forum Topic on Channel on Guilded REST API Request.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the forum topic on the Channel on Guilded REST API.
	 * @param query Query Params with Forum Topics Fetch from Guilded REST Api.
	 * @returns Forum Topic Object from Guilded.
	 * @example ForumTopicRouter.fetch('abc' , "xyz")
	 */

	async fetch(
		channelId: string,
		forumTopicId?: string,
		query?: restForumTopicsQueryParams,
	): Promise<ApiForumTopic | Array<ApiForumTopicSummary>> {
		if (forumTopicId)
			return await this.rest
				.get<{ forumTopic: ApiForumTopic }>(
					Endpoints.forumTopic(channelId, parseInt(forumTopicId)),
				)
				?.then((R) => R?.forumTopic);
		else
			return await this.rest
				.get<
					{ forumTopics: Array<ApiForumTopicSummary> },
					undefined,
					restForumTopicsQueryParams
				>(Endpoints.forumTopics(channelId), undefined, query)
				?.then((R) => R?.forumTopics);
	}

	/**
	 * Update or Edit Forum Topic on Channel on Guilded REST API Request.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the forum topic on the Channel on Guilded REST API.
	 * @param payload JSON Params for Forum Topics Update from Guilded REST Api.
	 * @returns Forum Topic Object from Guilded.
	 * @example ForumTopicRouter.update('abc' , "xyz")
	 */

	async update(
		channelId: string,
		forumTopicId: string,
		payload: restForumTopicUpdatePayload,
	): Promise<ApiForumTopic> {
		return await this.rest
			.patch<{ forumTopic: ApiForumTopic }, restForumTopicUpdatePayload>(
				Endpoints.forumTopic(channelId, parseInt(forumTopicId)),
				payload,
			)
			?.then((R) => R?.forumTopic);
	}

	/**
	 * Delete Forum Topic on Channel on Guilded REST API Request.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the forum topic on the Channel on Guilded REST API.
	 * @returns Boolean Value as "true" or Error
	 * @example ForumTopicRouter.delete('abc' , "xyz")
	 */

	async delete(channelId: string, forumTopicId: string): Promise<boolean> {
		return await this.rest
			.delete<void>(Endpoints.forumTopic(channelId, parseInt(forumTopicId)))
			?.then(() => true);
	}

	/**
	 * Pin Forum Topic on Channel on Guilded REST API Request.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the forum topic on the Channel on Guilded REST API.
	 * @returns Boolean Value as "true" or Error
	 * @example ForumTopicRouter.pin('abc' , "xyz")
	 */

	async pin(channelId: string, forumTopicId: string): Promise<boolean> {
		return await this.rest
			.put<void>(Endpoints.forumTopicPin(channelId, parseInt(forumTopicId)))
			?.then(() => true);
	}

	/**
	 * Un-Pin Forum Topic on Channel on Guilded REST API Request.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the forum topic on the Channel on Guilded REST API.
	 * @returns Boolean Value as "true" or Error
	 * @example ForumTopicRouter.unpin('abc' , "xyz")
	 */

	async unpin(channelId: string, forumTopicId: string): Promise<boolean> {
		return await this.rest
			.delete<void>(Endpoints.forumTopicPin(channelId, parseInt(forumTopicId)))
			?.then(() => true);
	}

	/**
	 * Lock Forum Topic on Channel on Guilded REST API Request.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the forum topic on the Channel on Guilded REST API.
	 * @returns Boolean Value as "true" or Error
	 * @example ForumTopicRouter.lock('abc' , "xyz")
	 */

	async lock(channelId: string, forumTopicId: string): Promise<boolean> {
		return await this.rest
			.put<void>(Endpoints.forumTopicLock(channelId, parseInt(forumTopicId)))
			?.then(() => true);
	}

	/**
	 * Un-Lock Forum Topic on Channel on Guilded REST API Request.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the forum topic on the Channel on Guilded REST API.
	 * @returns Boolean Value as "true" or Error
	 * @example ForumTopicRouter.unlock('abc' , "xyz")
	 */

	async unlock(channelId: string, forumTopicId: string): Promise<boolean> {
		return await this.rest
			.delete<void>(Endpoints.forumTopicLock(channelId, parseInt(forumTopicId)))
			?.then(() => true);
	}
}

export class ForumTopicCommentRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Create Forum Topic Comment on Forum Topic on Guilded REST API Request.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the forum topic on the Channel on Guilded REST API.
	 * @param payload New Forum Topic Comment payload on Guilded.
	 * @returns New Forum Topic Comment Object from Guilded.
	 * @example ForumTopicCommentRouter.create('abc' , "123", { content: "New Comment!!" })
	 */

	async create(
		channelId: string,
		forumTopicId: string,
		payload: restForumTopicCommentCreatePayload,
	): Promise<ApiForumTopicComment> {
		return await this.rest
			.post<{ forumTopicComment: ApiForumTopicComment }, restForumTopicCommentCreatePayload>(
				Endpoints.forumTopicComments(channelId, parseInt(forumTopicId)),
				payload,
			)
			?.then((R) => R?.forumTopicComment);
	}

	/**
	 * Fetch Forum Topic Comments or Specific Comment on Channel on Guilded REST API Request.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the forum topic on the Channel on Guilded REST API.
	 * @param forumTopicCommentId The ID of the forum topic comment on the Forum Topic on Guilded REST
	 * @returns Forum Topic Comment Object single or multiple from Guilded.
	 * @example ForumTopicCommentRouter.fetch('abc' , "xyz" , "1")
	 */

	async fetch(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId?: string,
	): Promise<ApiForumTopicComment | Array<ApiForumTopicComment>> {
		if (forumTopicCommentId)
			return await this.rest
				.get<{ forumTopicComment: ApiForumTopicComment }>(
					Endpoints.forumTopicComment(
						channelId,
						parseInt(forumTopicId),
						parseInt(forumTopicCommentId),
					),
				)
				?.then((R) => R?.forumTopicComment);
		else
			return await this.rest
				.get<{ forumTopicComments: Array<ApiForumTopicComment> }>(
					Endpoints.forumTopicComments(channelId, parseInt(forumTopicId)),
				)
				?.then((R) => R?.forumTopicComments);
	}

	/**
	 * Update Forum Topic Comment on Forum Topic on Guilded REST API Request.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the forum topic on the Channel on Guilded REST API.
	 * @param forumTopicCommentId The ID of the forum topic comment on the Forum Topic on Guilded REST
	 * @param payload Updated Forum Topic Comment payload on Guilded.
	 * @returns New Forum Topic Comment Object from Guilded.
	 * @example ForumTopicCommentRouter.update('abc' , "123", "2", { content: "Updated Comment!!" })
	 */

	async update(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
		payload: restForumTopicCommentCreatePayload,
	): Promise<ApiForumTopicComment> {
		return await this.rest
			.patch<{ forumTopicComment: ApiForumTopicComment }, restForumTopicCommentUpdatePayload>(
				Endpoints.forumTopicComment(
					channelId,
					parseInt(forumTopicId),
					parseInt(forumTopicCommentId),
				),
				payload,
			)
			?.then((R) => R?.forumTopicComment);
	}

	/**
	 * Delete Forum Topic Comment on Forum Topic on Guilded REST API Request.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the forum topic on the Channel on Guilded REST API.
	 * @param forumTopicCommentId The ID of the forum topic comment on the Forum Topic on Guilded REST
	 * @returns Success response as Boolean Value or Error
	 * @example ForumTopicCommentRouter.delete('abc' , 123, 2)
	 */

	async delete(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
	): Promise<Boolean> {
		return await this.rest
			.delete<void>(
				Endpoints.forumTopicComment(
					channelId,
					parseInt(forumTopicId),
					parseInt(forumTopicCommentId),
				),
			)
			?.then(() => true);
	}
}
