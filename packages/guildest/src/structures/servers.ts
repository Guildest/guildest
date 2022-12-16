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

export class Server extends Base<ApiServer> {
	readonly ownerId: string;
	type?: ApiServerType;
	name: string;
	uri?: string;
	members = new Collection<string, Member>();
	bans = new Collection<string, MemberBan>();
	webhooks = new Collection<string, Webhook>();
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

	get url(): string | undefined {
		if (!(this.uri && typeof this.uri === 'string')) return undefined;
		else return 'https://www.guilded.gg/' + this.uri;
	}

	get channels(): Collection<string, Channel> {
		return this.client.__collections.filter(
			(channel) => channel && channel instanceof Channel && channel.serverId === this.id,
		) as Collection<string, Channel>;
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
}

export class Member extends Base<ApiServerMemberResolve> {
	user: User;
	xp?: number = 0;
	roleIds?: string[];
	socialLinks = new Array<ApiBaseSocialLinks>();
	nickname?: string;
	joinedAt?: number;
	isOwner: boolean | null = null;

	constructor(client: Client, json: ApiServerMemberResolve) {
		super(client, { ...json, id: json.user.id });
		this.user = new User(this.client, json.user);
		this.roleIds = json.roleIds.map((role) => role?.toString());
		this.__update(json);
	}

	get name() {
		return this.user.name;
	}

	__update(json: Partial<ApiServerMemberResolve | { xp?: number }>) {
		if ('xp' in json) this.xp = json.xp;
		if ('joinedAt' in json) this.joinedAt = DateParse(json.joinedAt);
		if ('roleIds' in json) this.roleIds = json.roleIds?.map((role) => role?.toString());
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
		this.user = new User(this.client, json.user as ApiUserResolve);
		this.createdBy = json.createdBy;
		this.createdAt = Date.parse(json.createdAt);

		this.__update(json);
	}

	__update(json: Partial<ApiServerMemberBan>) {
		if ('reason' in json) this.reason = json.reason;
	}
}

export { ApiServerType as ServerTypes } from '@guildest/api-typings';
