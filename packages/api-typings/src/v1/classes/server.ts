import { ApiBase, ApiUser, ApiUserSummary } from './base';

/**
 * Represents Server Type on Guilded.
 * @see https://www.guilded.gg/docs/api/servers/Server
 */
export enum ApiServerType {
	Server = 'Server',
	Organization = 'organization',
	Community = 'community',
	Clan = 'clan',
	Guild = 'guild',
	Friends = 'friends',
	Streaming = 'streaming',
	Other = 'other',
}

/**
 * Represents Server Model or Structure on Guilded.
 * @see https://www.guilded.gg/docs/api/servers/Server
 */
export interface ApiServer extends ApiBase {
	/* Represents Id of the Server on the Guilded. */
	id: string;
	/* Represents User Id of the Server Owner or Founder on the Guilded. */
	ownerId: string;
	/* Represents User Id of the Server Owner or Founder on the Guilded. */
	type?: ApiServerType;
	/** Represents the Server Name in the Guilded. */
	name: string;
	/* Url of the Server Or Vanity Value to make a self Made Url duiring processing */
	url?: string;
	/* About Section of the Server on Guilded. */
	about?: string;
	/* Avatar Media-uri Value Associated with the Server on Guilded. */
	avatar?: string;
	/* Banner Media-uri Value Associated with the Server on Guilded. */
	banner?: string;
	/* Time-Zone Associated with the Server or Region on Guilded */
	timezone?: string;
	/* Verified Status of the Server on Guilded */
	isVerified?: boolean;
	/* Represents Default Channel Id of the Server on Guilded */
	defaultChannelId?: string;
	/* Represents the Created At Date/Time ISO-String of the Server on Guilded. */
	createdAt: string;
}

/**
 * Represents Server Member Summary(LTE) Model or Structure on Guilded.
 * @see https://www.guilded.gg/docs/api/members/ServerMemberSummary
 */
export interface ApiServerMemberSummary {
	/* Represent User Summary of Server Member Model on Guilded. */
	user: ApiUserSummary;
	/* Array of Roles Ids Associated with Server Member on Guilded. */
	roleIds: number[];
}

/**
 * Represents Server Member Model or Structure on Guilded.
 * @see https://www.guilded.gg/docs/api/members/ServerMember
 */
export interface ApiServerMember extends ApiServerMemberSummary {
	/* Represent User Data of Server Member Model on Guilded. */
	user: ApiUser;
	/* Represent NickName of Server Member on Guilded. */
	nickname?: string;
	/* Represent Joined At Data/Time ISO-String of Server Member on Guilded. */
	joinedAt: string;
	/* If User/Member is Server Owner on Guilded. */
	isOwner?: boolean;
}

/* Represents the Resolve for Server Member for Guilded Packages. */
export type ApiServerMemberResolve = ApiServerMember | ApiServerMemberSummary;

/**
 * Represents Server Member Update/Edit Payload on Guilded.
 * @see https://www.guilded.gg/docs/api/members/MemberNicknameUpdate
 */
export interface restServerMemberUpdatePayload {
	/* Represent New NickName for Specified Server Member on Guilded. */
	nickname: string;
}

/**
 * Represents Server Member Update/Edit Response on Guilded.
 * @see https://www.guilded.gg/docs/api/members/MemberNicknameUpdate
 */
export interface restServerMemberUpdateResponse {
	/* Represent New NickName for Specified Server Member on Guilded. */
	nickname: string;
}

/**
 * Represents Server Member Ban Payload on Guilded.
 * @see https://www.guilded.gg/docs/api/member-bans/ServerMemberBanCreate
 */
export interface restServerMemberBanPayload {
	/* Represent Valid Reason for Server Ban on Guilded. */
	reason?: string;
}

/**
 * Represents Server Member Ban on Guilded.
 * @see https://www.guilded.gg/docs/api/member-bans/ServerMemberBan
 */
export interface ApiServerMemberBan extends restServerMemberBanPayload {
	/* Represent User Data of Server Member Ban Model on Guilded. */
	user: ApiUserSummary;
	/* Represent Created By User Id of Server Member Ban Request/Payload on Guilded. */
	createdBy: string;
	/* Represent Created At Data/Time ISO-String of Server Member Ban Request/Payload on Guilded. */
	createdAt: string;
}

/**
 * Represents Server Award XP Payload to New Users on Guilded.
 * @see https://www.guilded.gg/docs/api/server-xp/ServerXpForUserCreate
 */
export interface restServerMemberAwardPayloadXp {
	/* Represent Amount of XP to New Server Members (max 1000,min -1000) on Server on Guilded */
	amount: number;
}

/**
 * Represents Server Member XP Award Response on Guilded.
 * @see https://www.guilded.gg/docs/api/server-xp/ServerXpForUserCreate
 * @see https://www.guilded.gg/docs/api/server-xp/ServerXpForUserUpdate
 */
export interface ApiServerMemberXpResponse {
	/* Represent Total Amount of XP of Server Members (max 1000000000,min -1000000000) on Server on Guilded */
	total: number;
}

/**
 * Represents Server Member XP Update Payload on Guilded.
 * @see https://www.guilded.gg/docs/api/server-xp/ServerXpForUserUpdate
 */
export interface restServerMemberUpdatePayloadXp {
	/* Represent Total Amount of XP of Server Members (max 1000000000,min -1000000000) on Server on Guilded */
	total: number;
}

/**
 * Represents Server Member Roles Array from Get Method on Guilded.
 * @see https://www.guilded.gg/docs/api/roleMembership/RoleMembershipReadMany
 */
export interface ApiServerMemberManyFetchRoles {
	/* Array of Roles Ids Associated with Server Member on Guilded. */
	roleIds: number[];
}
