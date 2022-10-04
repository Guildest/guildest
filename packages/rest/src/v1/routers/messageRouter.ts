import {
	ApiChannelMessageEditPayload,
	ApiChannelMessagePayload,
	ApiMessage,
	ApiMessagesFetchOptions,
	Endpoints,
} from '@guildest/guilded-api-typings';
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
	 * @param body The JSON Parameter of the channel.
	 * @returns The created New Message.
	 * @example MessageRouter.create( "abc", { content: 'Chat Message Content' });
	 */

	async create<R = ApiMessage>(channelId: string, body: ApiChannelMessagePayload): Promise<R> {
		return this.rest
			.post<{ message: R }>(Endpoints.messages(channelId), undefined, body)
			.then((R) => R.message);
	}

	/**
	 * Fetch Many or Single Channel Chat Message on Guilded.
	 * @param channelId Channel ID for Message on Guilded.
	 * @param messageId Message ID for Message on Guilded.
	 * @param fetchManyOptions The JSON Parameter of the Fetch Options for Messsages for channel.
	 * @returns The Messages or Message Value on Guilded.
	 * @example MessageRouter.fetch( "abc" , { content: 'Chat Message Content' });
	 */

	async fetch<R = ApiMessage>(
		channelId: string,
		messageId?: string,
		fetchManyOptions?: ApiMessagesFetchOptions,
	): Promise<R | Array<R>> {
		if (messageId)
			return this.rest
				.get<{ message: R }, any>(Endpoints.message(channelId, messageId), fetchManyOptions)
				?.then((R) => R.message);
		else
			return this.rest
				.get<{ messages: Array<R> }, ApiMessagesFetchOptions>(Endpoints.messages(channelId))
				?.then((R) => R.messages);
	}

	/**
	 * Update Channel Chat Message on Guilded.
	 * @param channelId Channel ID for Message on Guilded.
	 * @param messageId Message ID for Message on Guilded.
	 * @param body JSON Params for Message Update Payload.
	 * @returns The Message on Guilded.
	 * @example MessageRouter.update( "abc", "xyz" , { content: 'Chat Message Content' });
	 */

	async update<R = ApiMessage>(
		channelId: string,
		messageId: string,
		body: ApiChannelMessageEditPayload,
	): Promise<R> {
		return await this.rest.put<R>(Endpoints.message(channelId, messageId), undefined, body);
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
