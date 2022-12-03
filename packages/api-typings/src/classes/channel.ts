import type { ApiBase } from './base';

/**
 * Represents Channel Update Payload on Guilded.
 * @see https://www.guilded.gg/docs/api/channels/ChannelUpdate
 */
export interface restChannelUpdatePayload {
	/* The Name of the Channel. */
	name?: string;
	/* The Topic of the Channel. */
	topic?: string;
	/* Whether the Channel is Public. */
	isPublic?: boolean;
}

/**
 * Type of a channel on Guilded.
 * @see https://www.guilded.gg/docs/api/channels/ServerChannel
 */
export enum ApiChannelType {
	Announcements = 'announcements',
	Chat = 'chat',
	Calendar = 'calendar',
	Forums = 'forums',
	Media = 'media',
	Docs = 'docs',
	Voice = 'voice',
	List = 'list',
	Scheduling = 'scheduling',
	Stream = 'stream',
}

/**
 * Represents Server Channel on Guilded.
 * @see https://www.guilded.gg/docs/api/channels/ServerChannel
 */
export interface ApiServerChannel extends ApiBase {
	/* The Name of the Channel. */
	name: string;
	/* The Topic of the Channel. */
	topic?: string;
	/* The Creation Date in ISO String of Channel. */
	createdAt?: string;
	/* The Userd Id of User who Created the Channel. */
	createdBy: string;
	/* The Updated Date in ISO String of Channel. */
	updatedAt?: string;
	/* The Server Id of the Server where Channel is located. */
	serverId: string;
	/* The Parent Channel Id of the Thread Channel. */
	parentId?: string;
	/* The Category Channel Id of the Channel. */
	categoryId?: number;
	/* The Group Id Group Associated with the Channel. */
	groupId: string;
	/* Whether the Channel is Public. */
	isPublic?: boolean;
	/* The User Id who archived the Channel Or Thread. */
	archivedBy?: string;
	/* The Date ISO String when archived the Channel Or Thread. */
	archivedAt?: string;
}

/**
 * Represents Server Channel Create Payload on Guilded.
 * @see https://www.guilded.gg/docs/api/channels/ChannelCreate
 */
export interface restCreateChannelPayload extends restChannelUpdatePayload {
	/* The Name of the Channel. */
	name: string;
	/* The Topic of the Channel. */
	topic?: string;
	/* Whether the Channel is Public. */
	isPublic?: boolean;
	/*Type of a Channel on Guilded. */
	type: ApiChannelType;
	/* The Server Id of the Server where Channel is located. */
	serverId?: string;
	/* The Group Id Group Associated with the Channel. */
	groupId?: string;
	/* The Category Channel Id of the Channel. */
	categoryId?: number;
}
