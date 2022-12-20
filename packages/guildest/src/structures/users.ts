import { ApiBaseClientUser, ApiUserResolve, ApiUserType } from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';

/**
 * @class User Class Represents the Interfaces of User Model in Guilded API.
 */
export class User extends Base<ApiUserResolve> {
	/** User Type of the User Class */
	readonly type: ApiUserType;
	/** username of the User Class  */
	name?: string;
	/** Avatar of the User link */
	avatar?: string;
	/** Represents the Created Timestamp (ms) of the User on Guilded API. */
	createdAt?: number;
	/** Banner of the User Profile in Guilded. */
	banner?: string;

	/**
	 * Represents the User Class of the model on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example user = new User(client,data)
	 */
	constructor(client: Client, json: ApiUserResolve) {
		super(client, json);
		this.type = json.type ?? ApiUserType.User;
		this._update(json);
	}

	/** User's Bot Type Profile hceck as Boolean. */
	get bot() {
		return this.type === ApiUserType.Bot;
	}

	/**
	 * Update function for Updating properties with changed data
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	_update(json: Partial<ApiUserResolve>) {
		if ('createdAt' in json) this.createdAt = DateParse(json.createdAt);
		if ('avatar' in json) this.avatar = json.avatar;
		if ('banner' in json) this.banner = json.banner;
		if ('name' in json) this.name = json.name;
	}
}

/**
 * @class Client User Class Represents the Interfaces of Client User Model in Guilded API.
 */
export class ClientUser extends User {
	/**
	 * Represents the Client User Class of the model on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example user = new ClientUser(client,data)
	 */
	constructor(client: Client, data: ApiBaseClientUser) {
		super(client, { ...data, type: ApiUserType.Bot });
	}
}

export { ApiUserType as UserTypes } from '@guildest/api-typings';
