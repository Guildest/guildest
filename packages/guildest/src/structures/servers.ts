import type {
	ApiServer,
	ApiServerMemberBan,
	ApiServerMember,
	ApiServerType,
	ApiBaseUser,
} from '@guildest/api-typings';
import { ApiServerType as ServerTypes } from '@guildest/api-typings';
import { Base } from './base';
import type { Client } from './client';
import { User } from './users';

export class Server extends Base<ApiServer> {
	readonly ownerId: string;
	type?: ApiServerType;
	name: string;
	uri?: string;
	about?: string;
	avatar?: string;
	banner?: string;
	timezone?: string;
	isVerified?: boolean;
	defaultChannelId?: string;
	readonly createdAt: string;
	constructor(client: Client, json: ApiServer) {
		super(client, json);
		this.ownerId = json.ownerId;
		this.name = json.name;
		this.createdAt = json.createdAt;
	}

	__update(json: Partial<ApiServer>) {
		if ('type' in json) this.type = json.type;
		if ('url' in json) this.uri = json.url;
		if ('about' in json) this.about = json.about;
		if ('avatar' in json) this.avatar = json.avatar;
		if ('banner' in json) this.banner = json.banner;
		if ('timezone' in json) this.timezone = json.timezone;
		if ('isVerified' in json) this.isVerified = json.isVerified;
		if ('defaultChannelId' in json) this.defaultChannelId = json.defaultChannelId;
	}

	get url(): string | undefined {
		if (!(this.uri && typeof this.uri === 'string')) return undefined;
		else return 'https://www.guilded.gg/' + this.uri;
	}
}

export class Member extends Base<ApiServerMember> {
	user: User;
	roleIds?: number[];
	nickname?: string;
	joinedAt: number;
	isOwner: boolean | null = null;

	constructor(client: Client, json: ApiServerMember) {
		super(client, { ...json, id: json.user.id });
		this.user = new User(this.client, json.user);
		this.roleIds = json.roleIds;
		this.joinedAt = Date.parse(json.joinedAt);
		this.__update(json);
	}

	get username() {
		return this.user.name;
	}

	get type() {
		return this.user.type;
	}

	get bot() {
		return this.user.bot;
	}

	__update(json: Partial<ApiServerMember>) {
		if ('roleIds' in json) this.roleIds = json.roleIds;
		if ('nickname' in json) this.nickname = json.nickname;
		if ('isOwner' in json) this.isOwner = json.isOwner ?? false;
	}
}

export class MemberBan extends Base<ApiServerMemberBan> {
	user: User;
	reason?: string;
	readonly createdBy: string;
	readonly createdAt: number;

	constructor(client: Client, json: ApiServerMemberBan) {
		super(client, { ...json, id: json.user.id });
		this.user = new User(this.client, json.user as ApiBaseUser);

		this.createdBy = json.createdBy;
		this.createdAt = Date.parse(json.createdAt);

		this.__update(json);
	}

	__update(json: Partial<ApiServerMemberBan>) {
		if ('reason' in json) this.reason = json.reason;
	}
}

export { ServerTypes };
