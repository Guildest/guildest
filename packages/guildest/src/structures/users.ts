import type {
	ApiBaseClientUser,
	ApiBaseUser,
	ApiBaseUserSummary,
	ApiBaseUserType,
} from '@guildest/api-typings';
import { ApiBaseUserType as UserTypes } from '@guildest/api-typings';
import { Base } from './base';
import type { Client } from './client';

export class User extends Base<ApiBaseUserSummary> {
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

export { UserTypes };
