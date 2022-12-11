import { ApiBaseClientUser, ApiUserResolve, ApiUserType } from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';

export class User extends Base<ApiUserResolve> {
	readonly type: UserType;
	name?: string;
	avatar?: string;
	createdAt?: number;
	banner?: string;

	constructor(client: Client, json: ApiUserResolve) {
		super(client, json);
		this.type = json.type ?? 'user';
		this.__update(json);
	}

	get bot() {
		return this.type === 'bot';
	}

	__update(json: Partial<ApiUserResolve>) {
		if ('createdAt' in json) this.createdAt = DateParse(json.createdAt);
		if ('avatar' in json) this.avatar = json.avatar;
		if ('banner' in json) this.banner = json.banner;
		if ('name' in json) this.name = json.name;
	}
}
export class ClientUser extends User {
	constructor(client: Client, data: ApiBaseClientUser) {
		super(client, { ...data, type: 'bot' });
	}
}

export type UserType = keyof typeof ApiUserType;
