import type {
	ApiBaseClientUser,
	ApiBaseUser,
	ApiBaseUserType,
	ApiServerMember,
} from '@guildest/api-typings';
import { ApiBaseUserType as UserTypes } from '@guildest/api-typings';
import { Base } from './base';
import type { Client } from './client';

export class User extends Base<ApiBaseUser> {
	readonly type: ApiBaseUserType;
	name?: string;
	avatar?: string;
	readonly createdAt: number;
	banner?: string;

	constructor(client: Client, json: ApiBaseUser) {
		super(client, json);
		this.type = json.type ?? UserTypes.User;
		this.createdAt = Date.parse(json.createdAt);
		this.__update(json);
	}

	get bot() {
		return this.type === UserTypes.Bot;
	}

	__update(json: Partial<ApiBaseUser>) {
		if (json.avatar) this.avatar = json.avatar;
		if (json.banner) this.banner = json.banner;
		if (json.name) this.name = json.name;
	}
}

export class ClientUser extends User {
	constructor(client: Client, data: ApiBaseClientUser) {
		super(client, { ...data, type: UserTypes.Bot });
	}
}

export class Member extends Base<ApiServerMember> {
	user: User;
	roleIds?: number[];
	nickname?: string;
	joinedAt: string;
	isOwner: boolean | null = null;

	constructor(client: Client, json: ApiServerMember) {
		super(client, { ...json, id: json.user.id });
		this.user = new User(this.client, json.user);
		this.roleIds = json.roleIds;
		this.joinedAt = json.joinedAt;
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

export { UserTypes };
