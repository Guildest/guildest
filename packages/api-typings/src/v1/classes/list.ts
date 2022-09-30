import { ApiBase, ApiBaseMentions, ApiBaseListItemNote } from './base';

export interface ApiListItemSummary extends ApiBase {
	serverId: string;
	channelId: string;
	message: string;
	mentions?: ApiBaseMentions;
	createdAt: string;
	createdBy: string;
	createdByWebhookId?: string;
	updatedAt?: string;
	updatedBy?: string;
	parentListItemId?: string;
	completedAt?: string;
	completedBy?: string;
	note?: ApiBaseListItemNote;
}

export interface ApiListItemNote extends ApiBaseListItemNote {
	mentions?: ApiBaseMentions;
	content: string;
}

export interface ApiListItem extends ApiListItemSummary {
	note?: ApiListItemNote;
}

export interface ApiListItemNotePayload {
	content: string;
}

export interface ApiListItemPayload {
	message: string;
	note?: ApiListItemNotePayload;
}
