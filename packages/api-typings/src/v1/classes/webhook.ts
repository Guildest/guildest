/**
 * Represents Webhook Update Payload for Rest API Request.
 * @see https://www.guilded.gg/docs/api/webhook/WebhookUpdate
 */
export interface restWebhookUpdatePayload {
	/** The name of the webhook (min length 1; max length 128)  */
	name: string;
	/** The ID of the channel on Guilded. */
	channelId?: string;
}

/**
 * Represents Webhook Create Payload for Rest API Request.
 * @see https://www.guilded.gg/docs/api/webhook/WebhookCreate
 */
export interface restWebhookCreatePayload extends restWebhookUpdatePayload {
	/** The name of the webhook (min length 1; max length 128)  */
	name: string;
	/** Channel ID to create the webhook in */
	channelId: string;
}

/**
 * Represents Webhook Value on Guilded.
 * @see https://www.guilded.gg/docs/api/webhook/Webhook
 */
export interface ApiWebhook extends restWebhookCreatePayload {
	/** The ID of the webhook */
	id: string;
	/** The ID of the server */
	serverId: string;
	/** The ISO 8601 timestamp that the webhook was created at*/
	createdAt: string;
	/** The ID of the user who created this webhook */
	createdBy: string;
	/** The ISO 8601 timestamp that the webhook was deleted at */
	deletedAt?: string;
	/** The token of the webhook. */
	token?: string;
}

/**
 * Represents Webhook Value on Guilded.
 * @see https://www.guilded.gg/docs/api/webhook/Webhook
 */
export interface restWebhookQueryParams {
	/** Channel Id of the Server on Guilded. */
	channelId: string;
}
