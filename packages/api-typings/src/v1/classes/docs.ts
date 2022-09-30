import { ApiBaseMentions } from './base';

export interface ApiDocsPayload {
	title: string;
	content: string;
}

export interface ApiDocs extends ApiDocsPayload {
	id: string;
	serverId: string;
	channelId: string;
	mentions?: ApiBaseMentions;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
}
