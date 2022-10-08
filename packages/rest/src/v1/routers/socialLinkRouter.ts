import { ApiBaseSocialLinks, Endpoints } from '@guildest/guilded-api-typings';
import type { restManager } from '../restManager';

/**
 * The Social Link's Router for the Guilded REST Api.
 * @example new SocialLinkRouter(rest)
 */
export class SocialLinkRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Fetch Request of Social link on Guilded of Member.
	 * @param serverId The ID of the Server on Guilded.
	 * @param memberId The ID of the Member on Guilded.
	 * @param type The Type of the Social Link Connected on Guilded.
	 * @returns Social Link Object on Guilded of Member.
	 * @example SocialLinkRouter.fetch('abc' , 'foo' , 'bar')
	 */

	async fetch(serverId: string, memberId: string, type: string): Promise<ApiBaseSocialLinks> {
		return await this.rest
			.get<{ socialLink: ApiBaseSocialLinks }>(Endpoints.socialLink(serverId, memberId, type))
			?.then((R) => R?.socialLink);
	}
}
