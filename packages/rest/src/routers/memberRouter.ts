import {
	ApiServerMember,
	ApiServerMemberSummary,
	restServerMemberUpdatePayload,
	restServerMemberUpdateResponse,
	Endpoints,
	ApiBaseSocialLinks,
} from '@guildest/api-typings';
import { restManager } from '../restManager';

/**
 * The Server Member Router for the Guilded REST Api.
 * @example new MemberRouter(rest)
 */
export class MemberRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Update the Server Member's Nickname on Server on Guilded.
	 * @param serverId Server ID for Member on Guilded.
	 * @param memberId Member ID for Member on Guilded.
	 * @param payload Server Member Nickname payload.
	 * @returns Nickname Payload with new NickName after Update Request
	 * @example MemberRouter.update( "abc" , "xyz" , { nickname : "kaido" });
	 */

	async update(
		serverId: string,
		memberId: string,
		payload: restServerMemberUpdatePayload,
	): Promise<restServerMemberUpdateResponse> {
		return await this.rest.put<restServerMemberUpdateResponse, restServerMemberUpdatePayload>(
			Endpoints.serverNickname(serverId, memberId),
			payload,
		);
	}

	/**
	 * Delete the Server Member's Nickname on Server on Guilded.
	 * @param serverId Server ID for Member on Guilded.
	 * @param memberId Member ID for Member on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example MemberRouter.delete( "abc" , "xyz" );
	 */

	async delete<R = void>(serverId: string, memberId: string): Promise<boolean> {
		return await this.rest
			.delete<R>(Endpoints.serverNickname(serverId, memberId))
			.then(() => true);
	}

	/**
	 * Fetch Single Server Member on Guilded.
	 * @param serverId Server ID for Member on Guilded.
	 * @param memberId Member ID for Member on Guilded.
	 * @returns Server Member Value on Guilded.
	 * @example MemberRouter.fetch( "abc" , "xyz");
	 */

	async fetch(serverId: string, memberId: string): Promise<ApiServerMember> {
		return await this.rest
			.get<{ member: ApiServerMember }>(Endpoints.serverMember(serverId, memberId))
			.then((R) => R?.member);
	}

	/**
	 * Fetch Many / All Server Members from Guilded.
	 * @param serverId Server ID for Member on Guilded.
	 * @returns Server Members Value on Guilded.
	 * @example MemberRouter.fetchAll( "abc");
	 */

	async fetchAll(serverId: string): Promise<Array<ApiServerMemberSummary>> {
		return await this.rest
			.get<{ members: Array<ApiServerMemberSummary> }>(Endpoints.serverMembers(serverId))
			.then((R) => R?.members);
	}

	/**
	 * Fetch Request of Social link on Guilded of Member.
	 * @param serverId The ID of the Server on Guilded.
	 * @param memberId The ID of the Member on Guilded.
	 * @param type The Type of the Social Link Connected on Guilded.
	 * @returns Social Link Object on Guilded of Member.
	 * @example SocialLinkRouter.fetch('abc' , 'foo' , 'bar')
	 */

	async fetchSocialLinks(
		serverId: string,
		memberId: string,
		type: string,
	): Promise<ApiBaseSocialLinks> {
		return await this.rest
			.get<{ socialLink: ApiBaseSocialLinks }>(Endpoints.socialLink(serverId, memberId, type))
			?.then((R) => R?.socialLink);
	}

	/**
	 * Kick the Server Member on Guilded.
	 * @param serverId Server ID for Member on Guilded.
	 * @param memberId Member ID for Member on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example MemberRouter.kick( "abc" , "xyz");
	 */

	async kick<R = void>(serverId: string, memberId: string): Promise<boolean> {
		return this.rest.delete<R>(Endpoints.serverMember(serverId, memberId)).then(() => true);
	}
}
