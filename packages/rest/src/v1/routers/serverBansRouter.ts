import {
	ApiServerMemberBan,
	ApiServerMemberBanPayload,
	Endpoints,
} from '@guildest/guilded-api-typings';
import { restManager } from '../restManager';

/**
 * The Server Bans Router for the Guilded REST Api.
 * @example new ServerBansRouter(rest)
 */
export class ServerBansRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Server Member Ban Create REST API request on Guilded.
	 * @param serverId The ID of the server on Guilded
	 * @param memberId The ID of the Server Member on Guilded.
	 * @param payload Server Member Ban JSON Params for Payload for Request on Guilded REST API.
	 * @returns Server Member Ban on Guilded.
	 * @example ServerBansRouter.create('abc' , "xyz" , { reason: "foo" })
	 */

	async create(
		serverId: string,
		memberId: string,
		payload?: ApiServerMemberBanPayload,
	): Promise<ApiServerMemberBan> {
		return await this.rest
			.post<{ serverMemberBan: ApiServerMemberBan }, ApiServerMemberBanPayload>(
				Endpoints.serverBan(serverId, memberId),
				payload,
			)
			?.then((R) => R?.serverMemberBan);
	}

	/**
	 * Server Member Ban Fetch from REST API request on Guilded.
	 * @param serverId The ID of the server on Guilded
	 * @param memberId The ID of the Server Member on Guilded.
	 * @returns Server Member Ban on Guilded.
	 * @example ServerBansRouter.fetch('abc' , "xyz")
	 */

	async fetch(
		serverId: string,
		memberId: string,
	): Promise<ApiServerMemberBan | Array<ApiServerMemberBan>> {
		if (memberId)
			return this.rest
				.get<{ serverMemberBan: ApiServerMemberBan }>(
					Endpoints.serverBan(serverId, memberId),
				)
				.then((R) => R?.serverMemberBan);
		else
			return this.rest
				.get<{ serverMemberBans: Array<ApiServerMemberBan> }>(
					Endpoints.serverBans(serverId),
				)
				.then((R) => R?.serverMemberBans);
	}

	/**
	 * Server Member Ban Delete Request on REST API on Guilded.
	 * @param serverId The ID of the server on Guilded
	 * @param memberId The ID of the Server Member on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example ServerBansRouter.delete('abc' , "xyz")
	 */

	async delete<R = void>(serverId: string, memberId: string): Promise<boolean> {
		return await this.rest.delete<R>(Endpoints.serverBan(serverId, memberId)).then(() => true);
	}
}
