import { ApiServer, Endpoints } from '@guildest/api-typings';
import type { restManager } from '../restManager';

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

	async fetch(serverId: string): Promise<ApiServer> {
		return await this.rest
			.get<{ server: ApiServer }>(Endpoints.server(serverId))
			.then((R) => R?.server);
	}
}
