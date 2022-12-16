import { Endpoints } from '@guildest/api-typings';
import { restManager } from '../restManager';

/**
 * The Reaction's Router for the Guilded REST Api.
 * @example new ReactionRouter(rest)
 */
export class ReactionRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Add a Reaction to the Content OR Chat Message on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param contentId The ID of the Content OR Chat Message on Guilded.
	 * @param emoteId The Emote ID on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example ReactionRouter.addOnContent("abc" , "foo" , "bar");
	 */

	async addOnContent(channelId: string, contentId: string, emoteId: string): Promise<boolean> {
		return await this.rest
			.put<void>(Endpoints.reactionOnContent(channelId, contentId, parseInt(emoteId)))
			?.then(() => true);
	}

	/**
	 * Add a Reaction to the Forum Topic on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the Forum Topic on Guilded.
	 * @param emoteId The Emote ID on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example ReactionRouter.addOnForumTopic("abc" , "foo" , "bar");
	 */

	async addOnForumTopic(
		channelId: string,
		forumTopicId: string,
		emoteId: string,
	): Promise<boolean> {
		return await this.rest
			.put<void>(
				Endpoints.reactionOnForumTopic(
					channelId,
					parseInt(forumTopicId),
					parseInt(emoteId),
				),
			)
			?.then(() => true);
	}

	/**
	 * Add a Reaction to the Forum Topic Comment on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the Forum Topic on Guilded.
	 * @param forumTopicCommentId The ID of the Forum Topic Comment of Forum Topic on Guilded.
	 * @param emoteId The Emote ID on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example ReactionRouter.addOnForumTopicComment("abc" , "foo" , "xyz", "bar");
	 */

	async addOnForumTopicComment(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
		emoteId: string,
	): Promise<boolean> {
		return await this.rest
			.put<void>(
				Endpoints.reactionOnForumTopicComment(
					channelId,
					parseInt(forumTopicId),
					parseInt(forumTopicCommentId),
					parseInt(emoteId),
				),
			)
			?.then(() => true);
	}

	/**
	 * Remove a Reaction from the Content OR Chat Message on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param contentId The ID of the Content OR Chat Message on Guilded.
	 * @param emoteId The Emote ID on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example ReactionRouter.deleteFromContent("abc" , "foo" , "bar");
	 */

	async deleteFromContent(
		channelId: string,
		contentId: string,
		emoteId: string,
	): Promise<boolean> {
		return await this.rest
			.delete<void>(Endpoints.reactionOnContent(channelId, contentId, parseInt(emoteId)))
			?.then(() => true);
	}

	/**
	 * Remove a Reaction from the Forum Topic on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the Forum Topic on Guilded.
	 * @param emoteId The Emote ID on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example ReactionRouter.deleteFromForumTopic("abc" , "foo" , "bar");
	 */

	async deleteFromForumTopic(
		channelId: string,
		forumTopicId: string,
		emoteId: string,
	): Promise<boolean> {
		return await this.rest
			.delete<void>(
				Endpoints.reactionOnForumTopic(
					channelId,
					parseInt(forumTopicId),
					parseInt(emoteId),
				),
			)
			?.then(() => true);
	}

	/**
	 * Remove a Reaction from the Forum Topic Comment on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param forumTopicId The ID of the Forum Topic on Guilded.
	 * @param forumTopicCommentId The ID of the Forum Topic Comment on Guilded.
	 * @param emoteId The Emote ID on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example ReactionRouter.deleteFromForumTopicComment("abc" , "foo" , "xyz", "bar");
	 */

	async deleteFromForumTopicComment(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
		emoteId: string,
	): Promise<boolean> {
		return await this.rest
			.delete<void>(
				Endpoints.reactionOnForumTopicComment(
					channelId,
					parseInt(forumTopicId),
					parseInt(forumTopicCommentId),
					parseInt(emoteId),
				),
			)
			?.then(() => true);
	}
}
