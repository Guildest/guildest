import { ApiServer, Endpoints } from '@guildest/guilded-api-typings';
import { restManager } from '../restManager';

/**
 * The Server Router for the Guilded REST Api.
 * @example new ServerRouter(rest)
 */
export class ServerRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Fetch a Server from Guilded.
	 * @param serverId The ID of the Server to fetch.
	 * @returns The fetched Server.
	 * @example ServerRouter.fetch('abc');
	 */

	async fetch<R = ApiServer>(serverId: string): Promise<R> {
		return await this.rest
			.get<{ server: R }>(Endpoints.server(serverId))
			.then((R) => R?.server);
	}
}
