import {
	ApiServerMember,
	ApiServerMemberSummary,
	ApiServerMemberUpdatePayload,
	Endpoints,
} from '@guildest/guilded-api-typings';
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
		payload: ApiServerMemberUpdatePayload,
	): Promise<ApiServerMemberUpdatePayload> {
		return await this.rest.put<ApiServerMemberUpdatePayload, ApiServerMemberUpdatePayload>(
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
	 * Fetch Many or Single Server Member on Guilded.
	 * @param serverId Server ID for Member on Guilded.
	 * @param memberId Member ID for Member on Guilded.
	 * @returns Members or Member Value on Guilded.
	 * @example MemberRouter.fetch( "abc" , "xyz");
	 */

	async fetch(
		serverId: string,
		memberId: string,
	): Promise<ApiServerMember | Array<ApiServerMemberSummary>> {
		if (memberId)
			return await this.rest
				.get<{ member: ApiServerMember }>(Endpoints.serverMember(serverId, memberId))
				.then((R) => R?.member);
		else
			return await this.rest
				.get<{ members: Array<ApiServerMemberSummary> }>(Endpoints.serverMembers(serverId))
				.then((R) => R?.members);
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
