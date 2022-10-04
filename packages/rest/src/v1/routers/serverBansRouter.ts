import { restManager } from '../restManager';

/**
 * The Server Bans Router for the Guilded REST Api.
 * @example new ServerBansRouter(rest)
 */
export class ServerBansRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}
}
