import { restOptions } from '@guildest/rest';
import { webSocketManager, wsOptions } from '@guildest/ws';
import EventEmitter from 'events';
import { gateawayHandler } from '../events/gateawayHandler';
import { ClientUser } from './users';

export class Client extends EventEmitter {
	gateaway: gateawayHandler = new gateawayHandler(this);
	ws: webSocketManager = new webSocketManager({ token: this.token, ...this.option.ws });
	readyTimestamp?: number;
	user?: ClientUser;
	constructor(readonly token: string, public readonly option: ClientOption) {
		super();
	}

	async connect(token: string = this.token, force: boolean = false) {
		if (force) this.ws = new webSocketManager({ token: token, ...this.option.ws });
		this.ws.emitter.on('ready', (user) => {
			this.user = new ClientUser(this, user);
			this.readyTimestamp = Date.now();
			this.emit('ready');
		});
	}
}

export interface ClientOption {
	rest?: restOptions;
	ws?: wsOptions;
	caches?: {
		messages: false;
	};
}
