import {
	restChannelMessageEditPayload,
	restChannelMessageCreatePayload,
	ApiMessage,
	restMessageQueryParams,
	Endpoints,
	ApiEmbed,
	restChannelMessageCreateResolvable,
} from '@guildest/api-typings';
import { restManager } from '../restManager';

/**
 * The Message Router for the Guilded REST Api.
 * @example new MessageRouter(rest)
 */
export class MessageRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Create a Channel Chat Message on Guilded.
	 * @param channelId Channel ID for Message on Guilded.
	 * @param payload The JSON Parameter of the channel.
	 * @returns The created New Message.
	 * @example MessageRouter.create( "abc", { content: 'Chat Message Content' });
	 */

	async create(
		channelId: string,
		payload: restChannelMessageCreateResolvable,
	): Promise<ApiMessage> {
		return await this.rest
			.post<{ message: ApiMessage }, restChannelMessageCreatePayload>(
				Endpoints.messages(channelId),
				(typeof payload === 'string' ? { content: payload as string } : undefined) ??
					(Array.isArray(payload) ? { embeds: payload as Array<ApiEmbed> } : undefined) ??
					(payload as ApiMessage),
			)
			.then((R) => R.message);
	}

	/**
	 * Fetch Many or Single Channel Chat Message on Guilded.
	 * @param channelId Channel ID for Message on Guilded.
	 * @param messageId Message ID for Message on Guilded.
	 * @param query The Query Parameters of the Fetch Request for Messsages for Message on Guilded.
	 * @returns The Messages or Message Value on Guilded.
	 * @example MessageRouter.fetch( "abc" , "xyz" , { limit: 1 });
	 */

	async fetch(
		channelId: string,
		messageId?: string,
		query?: restMessageQueryParams,
	): Promise<ApiMessage | Array<ApiMessage>> {
		if (messageId)
			return this.rest
				.get<{ message: ApiMessage }, undefined, restMessageQueryParams>(
					Endpoints.message(channelId, messageId),
					undefined,
					query,
				)
				?.then((R) => R.message);
		else
			return this.rest
				.get<{ messages: Array<ApiMessage> }>(Endpoints.messages(channelId))
				?.then((R) => R.messages);
	}

	/**
	 * Update Channel Chat Message on Guilded.
	 * @param channelId Channel ID for Message on Guilded.
	 * @param messageId Message ID for Message on Guilded.
	 * @param payload JSON Params for Message Update Payload.
	 * @returns The Message on Guilded.
	 * @example MessageRouter.update( "abc", "xyz" , { content: 'Chat Message Content' });
	 */

	async update(
		channelId: string,
		messageId: string,
		payload: restChannelMessageEditPayload,
	): Promise<ApiMessage> {
		return await this.rest.put<ApiMessage, restChannelMessageEditPayload>(
			Endpoints.message(channelId, messageId),
			payload,
		);
	}

	/**
	 * Delete a Channel Chat Message from Guilded.
	 * @param channelId The ID of the channel to delete.
	 * @returns Boolean Value as "true" or Error
	 * @example MessageRouter.delete('abc',"xyz");
	 */

	async delete<R = void>(channelId: string, messageId: string): Promise<boolean> {
		return await this.rest.delete<R>(Endpoints.message(channelId, messageId)).then(() => true);
	}
}
