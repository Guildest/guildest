import {
	ApiListItem,
	restListItemPayload,
	ApiListItemSummary,
	Endpoints,
} from '@guildest/guilded-api-typings';
import { restManager } from '../restManager';

/**
 * The List Item's Router for the Guilded REST Api.
 * @example new ListItemRouter(rest)
 */
export class ListItemRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Create New List Item on Channel on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param payload The New List Item Payload Data for REST API.
	 * @returns New List Item Object on Guilded.
	 * @example new ListItemRouter.create("abc" , { message : "TODO list" })
	 */

	async create(channelId: string, payload: restListItemPayload): Promise<ApiListItem> {
		return await this.rest
			.post<{ listItem: ApiListItem }, restListItemPayload>(
				Endpoints.listItems(channelId),
				payload,
			)
			?.then((R) => R?.listItem);
	}

	/**
	 * Fetch List Items or List Item on Channel on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param listItemId The ID of the List Item on Guilded.
	 * @returns List Item Object on Guilded.
	 * @example new ListItemRouter.fetch("abc" , "xyz");
	 */

	async fetch(
		channelId: string,
		listItemId?: string,
	): Promise<ApiListItem | Array<ApiListItemSummary>> {
		if (listItemId)
			return await this.rest
				.get<{ listItem: ApiListItem }>(Endpoints.listItem(channelId, listItemId))
				?.then((R) => R?.listItem);
		else
			return await this.rest
				.get<{ listItems: Array<ApiListItemSummary> }>(Endpoints.listItems(channelId))
				?.then((R) => R?.listItems);
	}

	/**
	 * Update List Item on Channel on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param listItemId The ID of the List Item on Guilded.
	 * @param payload JSON Parameters for Update list Item on Guilded.
	 * @returns Updated List Item Object on Guilded.
	 * @example new ListItemRouter.update("abc" , "xyz");
	 */

	async update(
		channelId: string,
		listItemId: string,
		payload: restListItemPayload,
	): Promise<ApiListItem> {
		return await this.rest
			.put<{ listItem: ApiListItem }, restListItemPayload>(
				Endpoints.listItem(channelId, listItemId),
				payload,
			)
			?.then((R) => R?.listItem);
	}

	/**
	 * Delete List Item on Channel on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param listItemId The ID of the List Item on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example new ListItemRouter.delete("abc" , "xyz");
	 */

	async delete(channelId: string, listItemId: string): Promise<boolean> {
		return this.rest.delete<void>(Endpoints.listItem(channelId, listItemId)).then(() => true);
	}

	/**
	 * Mark List Item on Channel as "Complete" on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param listItemId The ID of the List Item on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example new ListItemRouter.complete("abc" , "xyz");
	 */

	async complete(channelId: string, listItemId: string): Promise<boolean> {
		return this.rest
			.post<void>(Endpoints.listItemComplete(channelId, listItemId))
			.then(() => true);
	}

	/**
	 * Remove the "Complete" Tag List Item on Channel on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param listItemId The ID of the List Item on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example new ListItemRouter.uncomplete("abc" , "xyz");
	 */

	async uncomplete(channelId: string, listItemId: string): Promise<boolean> {
		return this.rest
			.delete<void>(Endpoints.listItemComplete(channelId, listItemId))
			.then(() => true);
	}
}
