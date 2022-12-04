import { Endpoints } from '@guildest/api-typings';
import type { restManager } from '../restManager';

/**
 * The Group Membership's Router for the Guilded REST Api.
 * @example new GroupMembershipRouter(rest)
 */
export class GroupMembershipRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Add Member to the Respected Group under Server on Guilded.
	 * @param groupId The ID of the Group on Server on Guilded.
	 * @param memberId The ID of the Member on Server on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example GroupMembershipRouter.add("abc" , "foo")
	 */

	async add(groupId: string, memberId: string): Promise<boolean> {
		return this.rest.put<void>(Endpoints.groupMember(groupId, memberId))?.then(() => true);
	}

	/**
	 * Remove Member from Respected Group under Server on Guilded.
	 * @param groupId The ID of the Group on Server on Guilded.
	 * @param memberId The ID of the Member on Server on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example GroupMembershipRouter.remove("abc" , "foo")
	 */

	async remove(groupId: string, memberId: string): Promise<boolean> {
		return this.rest.delete<void>(Endpoints.groupMember(groupId, memberId))?.then(() => true);
	}
}
