import {
	restCreateChannelPayload,
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
	 * @param payload The JSON Parameter of the channel.
	 * @returns The created channel.
	 * @example ChannelRouter.create({ name: 'Chat', type: 'chat' });
	 */

	async create(payload: restCreateChannelPayload): Promise<ApiServerChannel> {
		return await this.rest
			.post<{ channel: ApiServerChannel }, restCreateChannelPayload>(
				Endpoints.channels,
				payload,
			)
			?.then((R) => R?.channel);
	}

	/**
	 * Fetch a channel from Guilded.
	 * @param channelId The ID of the channel to fetch.
	 * @returns The fetched channel.
	 * @example ChannelRouter.fetch('abc');
	 */

	async fetch(channelId: string): Promise<ApiServerChannel> {
		return await this.rest
			.get<{ channel: ApiServerChannel }>(Endpoints.channel(channelId))
			?.then((R) => R?.channel);
	}

	/**
	 * Edit a channel on Guilded.
	 * @param channelId The ID of the channel to edit.
	 * @param payload The JSON-Params of the channel.
	 * @returns The edited channel.
	 * @example ChannelRouter.update('abc', { name: 'Chat' });
	 */

	async update(channelId: string, payload: restCreateChannelPayload): Promise<ApiServerChannel> {
		return await this.rest
			.patch<{ channel: ApiServerChannel }, restCreateChannelPayload>(
				Endpoints.channel(channelId),
				payload,
			)
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
