export interface ApiWebhookUpdatePayload {
	name: string;
	channelId?: string;
}

export interface ApiWebhookCreatePayload extends ApiWebhookUpdatePayload {
	name: string;
	channelId: string;
}

export interface ApiWebhook extends ApiWebhookCreatePayload {
	id: string;
	serverId: string;
	createdAt: string;
	createdBy: string;
	deletedAt?: string;
	token?: string;
}
