import {
	restServerMemberAwardPayloadXp,
	restServerMemberUpdatePayloadXp,
	ApiServerMemberXpResponse,
	Endpoints,
} from '@guildest/api-typings';
import { restManager } from '../restManager';

/**
 * The Server XP's Router for the Guilded REST Api.
 * @example new ServerXPRouter(rest)
 */
export class ServerXPRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Server Member has been Awarded XP Respect to Server on Guilded.
	 * @param serverId The ID of the Server on Guilded.
	 * @param memberId The ID of the Member of the Server on Guilded.
	 * @param payload The JSON Parameters of the Amount of XP on Guilded.
	 * @returns The Total Amount of XP of Server Member Awarding XP on Guilded.
	 * @example ServerXPRouter.awardToMember("abc", "foo", { amount: 10 })
	 */

	async awardToMember(
		serverId: string,
		memberId: string,
		payload: restServerMemberAwardPayloadXp,
	): Promise<ApiServerMemberXpResponse> {
		return await this.rest.post<ApiServerMemberXpResponse, restServerMemberAwardPayloadXp>(
			Endpoints.serverMemberXp(serverId, memberId),
			payload,
		);
	}

	/**
	 * Server Member associated with Role has been Awarded XP Respect to Server on Guilded.
	 * @param serverId The ID of the Server on Guilded.
	 * @param roleId The ID of the Role of the Server on Guilded.
	 * @param payload The JSON Parameters of the Amount of XP on Guilded.
	 * @returns True or False Boolean Value on Success.
	 * @example ServerXPRouter.awardToRole("abc", "foo", { amount: 10 })
	 */

	async awardToRole(
		serverId: string,
		roleId: string,
		payload: restServerMemberAwardPayloadXp,
	): Promise<boolean> {
		return await this.rest
			.post<undefined, restServerMemberAwardPayloadXp>(
				Endpoints.serverRoleXp(serverId, parseInt(roleId)),
				payload,
			)
			.then(() => true);
	}

	/**
	 * Update Server Member XP Respect to Server on Guilded.
	 * @param serverId The ID of the Server on Guilded.
	 * @param memberId The ID of the Member of the Server on Guilded.
	 * @param payload The JSON Parameters of the Total Amount of XP on Guilded.
	 * @returns The Total Amount of XP of Server Member or "True" Boolean on Roles Awarding XP on Guilded.
	 * @example ServerXPRouter.updateToMember("abc", "foo" , { total: 10 })
	 */

	async updateToMember(
		serverId: string,
		memberId: string,
		payload: restServerMemberUpdatePayloadXp,
	): Promise<ApiServerMemberXpResponse> {
		return await this.rest.put<ApiServerMemberXpResponse, restServerMemberUpdatePayloadXp>(
			Endpoints.serverMemberXp(serverId, memberId),
			payload,
		);
	}
}
