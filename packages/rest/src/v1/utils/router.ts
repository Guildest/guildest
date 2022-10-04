import { restManager } from '../restManager';
import { ChannelRouter } from '../routers/channelRouter';
import { ServerRouter } from '../routers/serverRouter';

export class router {
	public readonly channels: ChannelRouter;
	public readonly servers: ServerRouter;
	constructor(public readonly rest: restManager) {
		this.channels = new ChannelRouter(rest);
		this.servers = new ServerRouter(rest);
	}
}
