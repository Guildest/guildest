import { Endpoints } from '@guildest/api-typings';
import type { restManager } from '../restManager';

/**
 * The Reaction's Router for the Guilded REST Api.
 * @example new ReactionRouter(rest)
 */
export class ReactionRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Add a Reaction to the Content OR Message on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param contentId The ID of the Content OR Chat Message on Guilded.
	 * @param emoteId The Emotte ID on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example ReactionRouter.add("abc" , "foo" , "bar");
	 */

	async add(channelId: string, contentId: string, emoteId: string): Promise<boolean> {
		return await this.rest
			.put<void>(Endpoints.reaction(channelId, contentId, parseInt(emoteId)))
			?.then(() => true);
	}

	/**
	 * Remove a Reaction from the Content OR Message on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param contentId The ID of the Content OR Chat Message on Guilded.
	 * @param emoteId The Emotte ID on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example ReactionRouter.remove("abc" , "foo" , "bar");
	 */

	async remove(channelId: string, contentId: string, emoteId: string): Promise<boolean> {
		return await this.rest
			.delete<void>(Endpoints.reaction(channelId, contentId, parseInt(emoteId)))
			?.then(() => true);
	}
}
