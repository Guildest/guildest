import {
	ApiMessage,
	ApiEmbed,
	ApiWebhook,
	restWebhookCreatePayload,
	restWebhookUpdatePayload,
	Endpoints,
	restWebhookQueryParams,
	restChannelMessageCreateResolvable,
} from '@guildest/api-typings';
import { restManager } from '../restManager';

/**
 * The Webhook's Router for the Guilded REST Api.
 * @example new WebhookRouter(rest)
 */
export class WebhookRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Create New Webhook Integration with Server on Guilded.
	 * @param serverId The ID of the Server on the Guilded.
	 * @param payload The Json Parameters as payload for Webshook
	 * @returns Webhook Object Data from REST API on Guilded.
	 * @example WebhookRouter.create('abc' , { name: "hello Webhook!" })
	 */

	async create(serverId: string, payload: restWebhookCreatePayload): Promise<ApiWebhook> {
		return await this.rest
			.post<{ webhook: ApiWebhook }, restWebhookCreatePayload>(
				Endpoints.webhooks(serverId),
				payload,
			)
			.then((R) => R?.webhook);
	}

	/**
	 * Fetch Single Webhook Integration with Server on Guilded.
	 * @param serverId The ID of the Server on the Guilded.
	 * @param webhookId The Id of the Webhook on the Server on the Guilded.
	 * @returns Webhook Object Data from REST API on Guilded.
	 * @example WebhookRouter.fetch('abc' ,"xyz" ,{ name: "hello Webhook!" })
	 */

	async fetch(serverId: string, webhookId: string): Promise<ApiWebhook> {
		return await this.rest
			.get<{ webhook: ApiWebhook }>(Endpoints.webhook(serverId, webhookId))
			?.then((R) => R?.webhook);
	}

	/**
	 * Fetch Many / All Webhook Integration with Server on Guilded.
	 * @param serverId The ID of the Server on the Guilded.
	 * @param query The Query Parameters for Fetching Many Webhooks from Server.
	 * @returns Webhook Objects Data from REST API on Guilded.
	 * @example WebhookRouter.fetchAll('abc' , { name: "hello Webhook!" })
	 */

	async fetchAll(serverId: string, query?: restWebhookQueryParams): Promise<Array<ApiWebhook>> {
		return await this.rest
			.get<{ webhooks: Array<ApiWebhook> }, undefined, restWebhookQueryParams>(
				Endpoints.webhooks(serverId),
				undefined,
				query,
			)
			?.then((R) => R?.webhooks);
	}

	/**
	 * Update Webhook Integration with Server on Guilded.
	 * @param serverId The ID of the Server on the Guilded.
	 * @param webhookId The Id of the Webhook on the Server on the Guilded.
	 * @param payload The Json Parameters as payload for Webshook
	 * @returns Updated Webhook Object Data from REST API on Guilded.
	 * @example WebhookRouter.update('abc' , "foo" , { name: "hello Webhook!" })
	 */

	async update(
		serverId: string,
		webhookId: string,
		payload: restWebhookUpdatePayload,
	): Promise<ApiWebhook> {
		return await this.rest
			.put<{ webhhook: ApiWebhook }, restWebhookUpdatePayload>(
				Endpoints.webhook(serverId, webhookId),
				payload,
			)
			.then((R) => R?.webhhook);
	}

	/**
	 * Delete Webhook Integration with Server on Guilded.
	 * @param serverId The ID of the Server on the Guilded.
	 * @param webhookId The Id of the Webhook on the Server on the Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example WebhookRouter.delete('abc' , "foo")
	 */

	async delete(serverId: string, webhookId: string): Promise<boolean> {
		return await this.rest
			.delete<void>(Endpoints.webhook(serverId, webhookId))
			?.then(() => true);
	}

	/**
	 * Execute or Send Message with Webhook ID and Webhook Token on Guilded.
	 * @param webhookId The Webhook ID of the Server on Guilded.
	 * @param webhookToken The Webhook Token of the Server on Guilded.
	 * @param payload The Message Payload for Webhook on REST API.
	 * @returns Message Object send with the Webhook.
	 * @example WebhookRouter.execute('abc' , "xyz" , { content : "Hello Workd" })
	 */

	async execute(
		webhookId: string,
		webhookToken: string,
		payload: restChannelMessageCreateResolvable,
	): Promise<ApiMessage> {
		return (await fetch(
			`https://media.guilded.gg${Endpoints.webhookExecute(webhookId, webhookToken)}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(
					(typeof payload === 'string' ? { content: payload as string } : undefined) ??
						(Array.isArray(payload)
							? { embeds: payload as Array<ApiEmbed> }
							: undefined) ??
						(payload as ApiMessage),
				),
			},
		)?.then(async (R) => await R.json())) as ApiMessage;
	}
}
