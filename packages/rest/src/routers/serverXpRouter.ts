import {
	restServerMemberAwardPayloadXp,
	restServerMemberUpdatePayloadXp,
	ApiServerMemberXpResponse,
	Endpoints,
} from '@guildest/api-typings';
import type { restManager } from '../restManager';

/**
 * The Server XP's Router for the Guilded REST Api.
 * @example new ServerXPRouter(rest)
 */
export class ServerXPRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Server Member or Members associated with Role Id has been Awarded XP Respect to Server on Guilded.
	 * @param serverId The ID of the Server on Guilded.
	 * @param payload The JSON Parameters of the Amount of XP on Guilded.
	 * @param memberId The ID of the Member of the Server on Guilded.
	 * @param roleId The ID of the Member Role of the Server on Guilded.
	 * @returns The Total Amount of XP of Server Member or "True" Boolean on Roles Awarding XP on Guilded.
	 * @example ServerXPRouter.award("abc", { amound: 10 } , "foo")
	 */

	async award(
		serverId: string,
		payload: restServerMemberAwardPayloadXp,
		memberId?: string,
		roleId?: string,
	): Promise<ApiServerMemberXpResponse | boolean> {
		if (roleId)
			return await this.rest.post<ApiServerMemberXpResponse, restServerMemberAwardPayloadXp>(
				Endpoints.serverRoleXp(serverId, parseInt(roleId)),
				payload,
			);
		else
			return await this.rest
				.post<void, restServerMemberAwardPayloadXp>(
					Endpoints.serverMemberXp(serverId, memberId!),
					payload,
				)
				?.then(() => true);
	}

	/**
	 * Update Server Member XP Respect to Server on Guilded.
	 * @param serverId The ID of the Server on Guilded.
	 * @param memberId The ID of the Member of the Server on Guilded.
	 * @param payload The JSON Parameters of the Total Amount of XP on Guilded.
	 * @returns The Total Amount of XP of Server Member or "True" Boolean on Roles Awarding XP on Guilded.
	 * @example ServerXPRouter.update("abc", "foo" , { total: 10 })
	 */

	async update(
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
