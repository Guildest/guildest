import {
	ApiCreateChannelPayload,
	ApiServerChannel,
	Endpoints,
} from '@guildest/guilded-api-typings';
import { restManager } from '../restManager';

/**
 * The Channel Router for the Guilded REST Api.
 * @example new ChannelRouter(rest)
 */
export class ChannelRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Create a channel on Guilded.
	 * @param body The JSON Parameter of the channel.
	 * @returns The created channel.
	 * @example ChannelRouter.create({ name: 'Chat', type: 'chat' });
	 */

	async create<R extends ApiServerChannel>(body: ApiCreateChannelPayload): Promise<R> {
		return await this.rest
			.post<{ channel: R }>(Endpoints.channels, undefined, body)
			?.then((R) => R?.channel);
	}

	/**
	 * Fetch a channel from Guilded.
	 * @param channelId The ID of the channel to fetch.
	 * @returns The fetched channel.
	 * @example ChannelRouter.fetch('abc');
	 */

	async fetch<R extends ApiServerChannel>(channelId: string): Promise<R> {
		return await this.rest
			.get<{ channel: R }>(Endpoints.channel(channelId))
			?.then((R) => R?.channel);
	}

	/**
	 * Edit a channel on Guilded.
	 * @param channelId The ID of the channel to edit.
	 * @param body The JSON-Params of the channel.
	 * @returns The edited channel.
	 * @example ChannelRouter.update('abc', { name: 'Chat' });
	 */

	async update<R extends ApiServerChannel>(
		channelId: string,
		body: ApiCreateChannelPayload,
	): Promise<R> {
		return await this.rest
			.patch<{ channel: R }>(Endpoints.channel(channelId), undefined, body)
			.then((R) => R?.channel);
	}

	/**
	 * Delete a channel from Guilded.
	 * @param channelId The ID of the channel to delete.
	 * @returns Boolean Value as "true" or Error
	 * @example ChannelRouter.delete('abc');
	 */

	async delete<R = void>(channelId: string): Promise<boolean> {
		return await this.rest.delete<R>(Endpoints.channel(channelId)).then(() => true);
	}
}
