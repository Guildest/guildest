import { ApiListItem } from '@guildest/api-typings';
import { Base } from './base';
import { Client } from './client';

export class ListItems extends Base<ApiListItem> {
	constructor(client: Client, json: ApiListItem) {
		super(client, json);
	}
}
