import type { ApiServerChannel } from '@guildest/api-typings';
import { ApiChannelType as ChannelTypes } from '@guildest/api-typings';
import { Base } from './base';
import type { Client } from './client';

export class Channel extends Base<ApiServerChannel> {
	readonly type: ApiServerChannel;
	constructor(client: Client, json: ApiServerChannel) {
		super(client, json);
		this.type = json.type;
	}
}

export { ChannelTypes };
