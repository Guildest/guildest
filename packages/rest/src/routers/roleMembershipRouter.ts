import { ApiServerMemberManyFetchRoles, Endpoints } from '@guildest/api-typings';
import { restManager } from '../restManager';

/**
 * The Role Membership's Router for the Guilded REST Api.
 * @example new RoleMembershipRouter(rest)
 */
export class RoleMembershipRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Add Role to Server Members on Guilded.
	 * @param serverId The ID of the Server on Guilded.
	 * @param memberId The ID of the Member of Server on Guilded.
	 * @param roleId The ID of the Role on Server on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example RoleMembershipRouter.add("abc" , "foo" , "bar")
	 */

	async add(serverId: string, memberId: string, roleId: string): Promise<boolean> {
		return await this.rest
			.put<void>(Endpoints.serverMemberRole(serverId, memberId, parseInt(roleId)))
			?.then(() => true);
	}

	/**
	 * Remove Role to Server Members on Guilded.
	 * @param serverId The ID of the Server on Guilded.
	 * @param memberId The ID of the Member of Server on Guilded.
	 * @param roleId The ID of the Role on Server on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example RoleMembershipRouter.remove("abc" , "foo" , "bar")
	 */

	async remove(serverId: string, memberId: string, roleId: string): Promise<boolean> {
		return await this.rest
			.delete<void>(Endpoints.serverMemberRole(serverId, memberId, parseInt(roleId)))
			?.then(() => true);
	}

	/**
	 * Fetch Role to Server Members on Guilded.
	 * @param serverId The ID of the Server on Guilded.
	 * @param memberId The ID of the Member of Server on Guilded.
	 * @returns Role Ids of the Member on Server on Guilded.
	 * @example RoleMembershipRouter.fetch("abc" , "foo")
	 */

	async fetch(serverId: string, memberId: string): Promise<ApiServerMemberManyFetchRoles> {
		return await this.rest.put<ApiServerMemberManyFetchRoles>(
			Endpoints.serverMemberRoles(serverId, memberId),
		);
	}
}
