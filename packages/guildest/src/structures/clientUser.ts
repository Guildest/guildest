import type { ApiBaseClientUser } from '@guildest/api-typings';
import { Base } from './base';
import type { Client } from './client';

export class ClientUser extends Base<ApiBaseClientUser> {
	constructor(client: Client, data: ApiBaseClientUser) {
		super(client, data);
	}
}
