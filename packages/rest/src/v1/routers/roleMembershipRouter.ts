import { Endpoints } from '@guildest/guilded-api-typings';
import { restManager } from '../restManager';

/**
 * The Reaction's Router for the Guilded REST Api.
 * @example new ReactionRouter(rest)
 */
export class ReactionRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}
}
