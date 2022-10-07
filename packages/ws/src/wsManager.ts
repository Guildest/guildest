import EventEmitter from 'events';
import webSocket from 'ws';
import { version } from '../package.json';
import {
	wsMessagePayload,
	wsReadyPayload,
	wsOpGatawayCode,
	wsEvents,
	ApiBaseClientUser,
} from '@guildest/guilded-api-typings';

/**
 * Guilded API Websocket Manager for CLient/User Based Web Applications
 * @example wsMod = new webSocketManager({ version: 1,token: "xxxx" });
 */
export class webSocketManager extends EventEmitter {
	/** Represents the Version of the Websocket Manager/Handler on Guilded. */
	version: number | undefined = 1;
	/** Represents the Proxy Data like Url , Metadata for Websocket */
	proxy: proxyOptions | undefined;
	/** Client / User Token for Authorising the CLient in Websocket API. */
	token: string | undefined;
	/** Internal Websocket Handler for raw socket connection management for Guilded Websocket API. */
	socket: webSocket | undefined;
	/** Guilded Last Event Message Id along the con-current Websocket API event calls. */
	lastMessageId: string | undefined;
	/** Ready At Timestmap in milliseconds from "Date.now()" function during socket emitting Ready event. */
	readyAt: number | undefined;
	/** Numerical Attempts of Reconnect for Now for Websocket sudden disconnect and reconnect operation checks. */
	reconnectAttempts = 0;
	/** Last Time Socket Pinged Timestamp in Guilded's Websocket. */
	lastPingAt: number | undefined;
	/** Last Time Socket Ponged Timestamp in Guilded's Websocket after Ping event emittion. */
	lastPongAt: number | undefined;

	/** @param options Websocket Options for  */
	constructor(public readonly options: wsOptions) {
		super();
		this.token = options.token;
		this.proxy = options.proxy;
		if (!this.proxy?.url) this.version = options.version;
	}

	/** If Websocket is established a secure connection with Guilded. */
	get isReady(): boolean {
		return Boolean(this.readyAt);
	}

	/** Ping-Pong Difference Trigger Time Value of Application with Guilded Websocket API. */
	get ping(): number {
		if (!(this.lastPingAt && this.lastPongAt)) return 0;
		else return this.lastPongAt - this.lastPingAt;
	}

	/** Alive Connection Time until now in Milliseconds of Guilded Websocket API. */
	get upTime(): number {
		if (!this.readyAt) return 0;
		else return Date.now() - this.readyAt!;
	}

	/** Websocket Url for interacting with Guilded. */
	get url(): string {
		return this.proxy?.url ?? `wss://www.guilded.gg/websocket/v${this.version}`;
	}

	/**
	 * Connect Request to the Guilded Websocket API.
	 * @param token The Guilded API Authorization token.
	 * @returns The Websocket manager for Guilded Websocket API.
	 * @example wsMod.connect('xxx-token-xxx');
	 */
	connect(token: string = this.token!): this {
		this.token = token;
		this.socket = new webSocket(this.url, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				'User-Agent': `@guildest/ws@${version} Node.JS@${process.versions.node}`,
				'guilded-last-message-id': this.lastMessageId ?? '',
			},
		});

		this.socket.on('close', this.onSocketDisconnect.bind(this));
		this.socket.on('message', (metadata) =>
			this.onSocketPayload(JSON.parse(metadata.toString())),
		);
		this.socket.on('ping', () => {
			this.lastPingAt = Date.now();
			if (!this.options.skipOptions?.internalEvents) this.emit('ping', this.lastPingAt, this);
		});
		this.socket.on('pong', () => {
			this.lastPongAt = Date.now();
			if (!this.options.skipOptions?.internalEvents) this.emit('pong', this.lastPongAt, this);
		});
		return this;
	}

	/**
	 * Disconnect Connection Request with the Guilded Websocket API.
	 * @returns The Websocket manager for Guilded Websocket API.
	 * @example wsMod.disconnect();
	 */
	disconnect(): this {
		if (!this.socket?.OPEN)
			throw new Error('[Websocket-Connection] : Websocket is not Connected!');
		this.socket.terminate();
		return this;
	}

	/** @ignore */
	private onSocketPayload({ op, t, d, s }: wsMessagePayload): void {
		if (s) this.lastMessageId = s;
		switch (op) {
			case wsOpGatawayCode.Event:
				if (!this.options.skipOptions?.internalEvents) this.emit('event', t as any, d);
				break;
			case wsOpGatawayCode.Ready:
				this.readyAt = Date.now();
				if (!this.options?.skipOptions?.internalEvents)
					this.emit('ready', (d as wsReadyPayload).user);
				this.lastPingAt = Date.now();
				this.socket!.ping();
				break;
			case wsOpGatawayCode.Resume:
				delete this.lastMessageId;
				break;
		}
	}

	/** @ignore */
	private onSocketDisconnect(): boolean {
		this.socket = undefined;
		this.readyAt = undefined;
		if (!this.options.skipOptions?.internalEvents) this.emit('disconnect', this);
		if (
			!this.options.reconnect ||
			this.reconnectAttempts >= (this.options.maxReconnects ?? Infinity)
		)
			return true;
		else ++this.reconnectAttempts;
		this.connect(this.token);
		if (!this.options.skipOptions?.internalEvents)
			this.emit('reconnect', this, this.reconnectAttempts);
		return true;
	}
}

/** The options for the Websocket manager. */
export interface wsOptions {
	/** The auth token for the Websocket API. */
	token: string;
	/** The version of the Websocket API. */
	version?: number;
	/** Proxy Options of the Websocket API. */
	proxy?: proxyOptions;
	/** The maximum number of reconnect attempts. */
	maxReconnects?: number;
	/** Whether to allow reconnects. */
	reconnect?: boolean;
	/** Skip Options for Boosting Performance */
	skipOptions?: skipOptions;
}

/** Skip Options for Websocket Manager. */
export interface skipOptions {
	/** Skip Emitting Internal Events. */
	internalEvents?: boolean;
	/** Skip Emitting External Events. */
	externalEvents?: boolean;
}

/** Proxy Options of the Websocket API */
export interface proxyOptions {
	/** The proxy URL of the Websocket API. */
	url?: string;
}

/** Websocket Manager Events (internal) for Websocket API. */
export interface wsManagerEvents {
	/** Ready Event Trigger on Websocket Connection establishment. */
	ready: [user: ApiBaseClientUser];
	/** Reconnet Event on Websocket Connection re-connection on disurption. */
	reconnect: [ws: webSocketManager];
	/** Disconnect Event on Websocket Connection destroyed or close. */
	disconnect: [ws: webSocketManager];
	/** Ping Response from Websocekt API Connection. */
	ping: [timestamp: number, ws: webSocketManager];
	/** Pong Response after Ping Conversation - Message Delivery. */
	pong: [timestamp: number, ws: webSocketManager];
	/** Custom Event on Websocket's socket Message Payload. */
	event: {
		[Event in keyof wsEvents]: [event: Event, metadta: wsEvents[Event]];
	}[keyof wsEvents];
}

/**  Websocekt Manager Event Management Interfaces. */
export interface websocketManager {
	/** @ignore */
	on<Event extends keyof wsManagerEvents>(
		event: Event,
		listener: (...args: wsManagerEvents[Event]) => any,
	): this;
	/** @ignore */
	once<Event extends keyof wsManagerEvents>(
		event: Event,
		listener: (...args: wsManagerEvents[Event]) => any,
	): this;
	/** @ignore */
	off<Event extends keyof wsManagerEvents>(
		event: Event,
		listener: (...args: wsManagerEvents[Event]) => any,
	): this;
	/** @ignore */
	emit<Event extends keyof wsManagerEvents>(
		event: Event,
		...args: wsManagerEvents[Event]
	): boolean;
}
