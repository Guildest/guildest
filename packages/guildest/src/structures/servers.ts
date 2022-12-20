import {
	ApiServer,
	ApiServerMemberBan,
	ApiServerType,
	ApiUserResolve,
	ApiServerMemberResolve,
	ApiBaseSocialLinks,
} from '@guildest/api-typings';
import { Collection } from '@guildest/collection';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';
import { User } from './users';
import { Channel } from './channels';
import { Webhook } from './webhooks';

/**
 * @class Server Class Represents the Interfaces of Server Model in Guilded API.
 */
export class Server extends Base<ApiServer> {
	/** Server owner Id of the Server in Guilded. */
	readonly ownerId: string;
	/** Type of the Server in Guilded. */
	type?: ApiServerType;
	/** Name of the Server in Guilded. */
	name: string;
	/** uri of the Server in Guilded. */
	uri?: string;
	/** Collection of Members of the Server in Guilded. */
	members = new Collection<string, Member>();
	/** Collection of Bans of the Server in Guilded. */
	bans = new Collection<string, MemberBan>();
	/** Collection of Webhooks of the Server in Guilded. */
	webhooks = new Collection<string, Webhook>();
	/** About of the Server in Guilded. */
	about?: string;
	/** avatar Url of the Server in Guilded. */
	avatar?: string;
	/** Banner Url of the Server in Guilded. */
	banner?: string;
	/** Timezone of the Server in Guilded. */
	timezone?: string;
	/** if Verified Boolean Value of the Server in Guilded. */
	isVerified?: boolean;
	/** Default Channel Id of the Server in Guilded. */
	defaultChannelId?: string;
	/** Represents the Created Timestamp (ms) of the Server on Guilded API. */
	readonly createdAt: string;

	/**
	 * Represents the Server Class of the model on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example server = new Server(client,data)
	 */
	constructor(client: Client, json: ApiServer) {
		super(client, json);
		this.ownerId = json.ownerId;
		this.name = json.name;
		this.createdAt = json.createdAt;
	}

	/** Url of the Server in Guilded. */
	get url(): string | undefined {
		if (!(this.uri && typeof this.uri === 'string')) return undefined;
		else return 'https://www.guilded.gg/' + this.uri;
	}

	/** Collection of Channels of the Server in Guilded. */
	get channels(): Collection<string, Channel> {
		return this.client.__collections.filter(
			(channel) => channel && channel instanceof Channel && channel.serverId === this.id,
		) as Collection<string, Channel>;
	}

	/**
	 * Update function for Updating properties with changed data
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	_update(json: Partial<ApiServer>) {
		if ('type' in json) this.type = json.type;
		if ('url' in json) this.uri = json.url;
		if ('about' in json) this.about = json.about;
		if ('avatar' in json) this.avatar = json.avatar;
		if ('banner' in json) this.banner = json.banner;
		if ('timezone' in json) this.timezone = json.timezone;
		if ('isVerified' in json) this.isVerified = json.isVerified;
		if ('defaultChannelId' in json) this.defaultChannelId = json.defaultChannelId;
	}
}

/**
 * @class Server Member Class Represents the Interfaces of Server Member Model in Guilded API in Server.
 */
export class Member extends Base<ApiServerMemberResolve> {
	/** Represents the User Object in the Member */
	user: User;
	/** Member XP Value in the Server */
	xp?: number = 0;
	/** Server Id of the Member in Guilded. */
	serverId?: string;
	/** Array of Server Roles assigned to the Server member */
	roleIds?: string[];
	/** Associated Social Links of the Member */
	socialLinks = new Array<ApiBaseSocialLinks>();
	/** Server nickname of the Member */
	nickname?: string;
	/** The Timestamp (ms) of Member Joining the Server */
	joinedAt?: number;
	/** If Member is the Owner in the Server */
	isOwner: boolean | null = null;

	/**
	 * Represents the Member Class of the model on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example member = new Member(client,data)
	 */
	constructor(client: Client, json: ApiServerMemberResolve & { serverId: string }) {
		super(client, { ...json, id: json.user.id });
		this.user = new User(this.client, json.user);
		this.roleIds = json.roleIds.map((role) => role?.toString());
		this._update(json);

		this.client.__collections.add(this.user.id, this.user, true);
	}

	/** Member name of the Member. */
	get name(): string | undefined {
		return this.user.name;
	}

	/** Member's Server belonged to Guilded. */
	get server(): Server | undefined {
		if (!this.serverId) return undefined;
		else return this.client.getServer(this.serverId);
	}

	/**
	 * Update function for Updating properties with changed data
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	_update(json: Partial<ApiServerMemberResolve | { xp?: number; serverId: string }>) {
		if ('serverId' in json) this.serverId = json.serverId;
		if ('xp' in json) this.xp = json.xp;
		if ('joinedAt' in json) this.joinedAt = DateParse(json.joinedAt);
		if ('roleIds' in json) this.roleIds = json.roleIds?.map((role) => role?.toString());
		if ('nickname' in json) this.nickname = json.nickname;
		if ('isOwner' in json) this.isOwner = json.isOwner ?? false;
	}
}

/**
 * @class Server Member Ban Class Represents the Interfaces of Server Member Ban Model in Guilded API in Server.
 */
export class MemberBan extends Base<ApiServerMemberBan> {
	/** Represents the User Object in the Member */
	user: User;
	/** Reason for Member Ban in the Server. */
	reason?: string;
	/** User Id of the User created the Ban in Server. */
	readonly createdById: string;
	/** Server member Ban Creation Timestamp (ms) in Server */
	readonly createdAt: number;

	/**
	 * Represents the Member Ban Class of the model on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example ban = new MemberBan(client,data)
	 */
	constructor(client: Client, json: ApiServerMemberBan) {
		super(client, { ...json, id: json.user.id });
		this.user = new User(this.client, json.user as ApiUserResolve);
		this.createdById = json.createdBy;
		this.createdAt = Date.parse(json.createdAt);

		this._update(json);
	}

	/**
	 * Update function for Updating properties with changed data
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	_update(json: Partial<ApiServerMemberBan>) {
		if ('reason' in json) this.reason = json.reason;
	}
}

export { ApiServerType as ServerTypes } from '@guildest/api-typings';
