import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import webSocket from 'ws';
import {
	wsMessagePayload,
	wsReadyPayload,
	wsOpGatawayCode,
	wsEvents,
	ApiBaseClientUser,
} from '@guildest/api-typings';
import { version } from '../package.json';

/**
 * Guilded API Websocket Manager for CLient/User Based Web Applications
 * @example wsMod = new webSocketManager({ version: 1,token: "xxxx" });
 */
export class webSocketManager {
	/** Represents the Version of the Websocket Manager/Handler on Guilded. */
	version: number | undefined = 1;
	/** Represents the Proxy Data like Url , Metadata for Websocket */
	proxy: proxyOptions | undefined;
	/** Client / User Token for Authorising the CLient in Websocket API. */
	token: string;
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
	/** Numerical Attempts of Reconnect for Now for Websocket Errors on Connection. */
	reconnectOnErrorAttempts = 0;
	/** Connection Started Timestamp in "Date" */
	connectedAt?: Date;
	/** Event Emitter of the Web Socket for the Guilded API events. */
	emitter = new EventEmitter() as TypedEmitter<wsManagerEvents>;

	/** @param options Websocket Options for  */
	constructor(public readonly options: wsOptions) {
		this.token = options.token!;
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

	/** Websocket Connected Status for interacting with Guilded. */
	get isConnected(): boolean {
		return Boolean(this.socket?.OPEN);
	}

	/** Websocket Reconnect Status for checking Max Reconnects. */
	get reconnectExceeded() {
		return (this.options.maxReconnects ?? Infinity) <= this.reconnectAttempts;
	}

	/** Websocket Reconnect Error Status for checking Max Reconnects. */
	get reconnectOnErrorExceeded() {
		return (this.options.maxReconnectsOnError ?? Infinity) <= this.reconnectOnErrorAttempts;
	}

	/**
	 * Connect Request to the Guilded Websocket API.
	 * @param token The Guilded API Authorization token.
	 * @returns Void Return upon success or failure of socket Connection.
	 * @example wsMod.connect('xxx-token-xxx');
	 */
	connect(token: string = this.token): void {
		this.token = token;
		try {
			this.socket = new webSocket(this.url, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					'User-Agent': `@guildest/ws@${version} Node.JS@${process.versions.node}`,
					'guilded-last-message-id': this.lastMessageId ?? '',
				},
			});
		} catch (error) {
			if (error instanceof Error) {
				this.emitter.emit('error', error.message, error);
				this.onSocketDebug(error.message, 'Websocket Error');
			}
			this.handleDisconnect();
			this.lastMessageId = undefined;
			return;
		}

		this.socket.on('open', this.onSocketOpen.bind(this));
		this.socket.on('close', this.onSocketDisconnect.bind(this));
		this.socket.on('message', (body) => this.onSocketPayload(body.toString()));
		this.socket.on('ping', () => {
			this.lastPingAt = Date.now();
			if (!this.options.skipOptions?.internalEvents) this.emitter.emit('ping', this);
		});
		this.socket.on('pong', () => {
			this.lastPongAt = Date.now();
			if (!this.options.skipOptions?.internalEvents) this.emitter.emit('pong', this);
		});
		this.socket.on('error', (err) => {
			this.onSocketDebug('Gateway Connection faced Error', 'Gateway Error');
			this.emitter.emit('error', 'Gateway Error', err);
			this.handleDisconnect();
			this.emitter.emit(
				'close',
				'Gateway connection permanently closed due to Gataway Error.',
				this,
			);
		});
		return;
	}

	/**
	 * Disconnect Connection Request with the Guilded Websocket API.
	 * @returns The Websocket manager for Guilded Websocket API.
	 * @example wsMod.disconnect();
	 */
	disconnect(): this {
		if (!this.socket) throw new Error('[Websocket-Connection] : Websocket is not Connected!');
		this.socket.removeAllListeners();
		if (this.socket.OPEN) this.socket.close();
		return this;
	}

	/** @ignore */
	private handleDisconnect() {
		this.onSocketDebug('Socket connection has been Severed', 'Error Disconnection');
		if ((this.options.reconnectOnError ?? true) && !this.reconnectOnErrorExceeded) {
			this.reconnectAttempts++;
			return this.connect();
		}
		return this.disconnect();
	}

	/** @ignore */
	private onSocketOpen(): void {
		this.onSocketDebug('Socket connection has been opened.', 'Socket Open');
		this.connectedAt = new Date();
	}

	/** @ignore */
	private onSocketDebug(message: string, name: string = 'LOG'): void {
		this.emitter.emit('debug', `[${name}] : ${message}`, this);
	}

	/** @ignore */
	private onSocketPayload(body: string): void {
		let eventPayload: wsMessagePayload;
		try {
			eventPayload = JSON.parse(body) as wsMessagePayload;
			this.emitter.emit('payload', eventPayload, this);
		} catch (error) {
			this.emitter.emit('error', 'Json Body Parsing Error', error as Error, {
				message: body,
			});
			return;
		}
		const { op, t, s, d } = eventPayload;

		if (s) this.lastMessageId = s;
		switch (op) {
			case wsOpGatawayCode.Event:
				if (!this.options.skipOptions?.internalEvents)
					this.emitter.emit('gateaway', t as any, d);
				break;
			case wsOpGatawayCode.Ready:
				this.readyAt = Date.now();
				if (!this.options?.skipOptions?.internalEvents)
					this.emitter.emit('ready', (d as wsReadyPayload).user, this);
				this.lastPingAt = Date.now();
				this.socket!.ping();
				break;
			case wsOpGatawayCode.Resume:
				this.lastMessageId = undefined;
				break;
			default:
				this.emitter.emit(
					'unknown',
					'Unkown Websocket OP Code is Detected',
					{
						body,
						payload: eventPayload,
					},
					this,
				);
				break;
		}
	}

	/** @ignore */
	private onSocketDisconnect(): boolean {
		this.socket = undefined;
		this.readyAt = undefined;
		if (!this.options.skipOptions?.internalEvents) this.emitter.emit('disconnect', this);
		if (!this.options.reconnect || this.reconnectExceeded) return true;
		else ++this.reconnectAttempts;
		this.connect(this.token);
		if (!this.options.skipOptions?.internalEvents)
			this.emitter.emit('reconnect', this.reconnectAttempts, this);
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
	/** Whether to allow reconnects on Web-Socket Error */
	reconnectOnError?: boolean;
	/** The maximum number of reconnect attempts on Web-Socket Error. */
	maxReconnectsOnError?: number;
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
export type wsManagerEvents = {
	/** Ready Event Trigger on Websocket Connection establishment. */
	ready: (user: ApiBaseClientUser, ws: webSocketManager) => unknown;
	/** Reconnet Event on Websocket Connection re-connection on disurption. */
	reconnect: (count: number, ws: webSocketManager) => unknown;
	/** Disconnect Event on Websocket Connection destroyed or close. */
	disconnect: (ws: webSocketManager) => unknown;
	/** Ping Response from Websocekt API Connection. */
	ping: (ws: webSocketManager) => unknown;
	/** Pong Response after Ping Conversation - Message Delivery. */
	pong: (ws: webSocketManager) => unknown;
	/** Error Response for Web-Socket Connection or Internal Errors. */
	error: (message: string, error?: Error, data?: Record<string, any>) => unknown;
	/** Close / Exit Response for Web-Socket Connection or Internal. */
	close: (message: string, ws: webSocketManager) => unknown;
	/** Unknown Response from  */
	unknown: (message: string, data: Record<string, any>, ws: webSocketManager) => unknown;
	/** Custom Event on Websocket's socket Message Payload. */
	gateaway: <Event extends keyof wsEvents>(event: Event, metadta: wsEvents[Event]) => void;
	/** Debug Response on Web-Socket Working and Routing in the Manager. */
	debug: (message: string, ws: webSocketManager) => void;
	/** Raw Message Payload from API Web-Socket Manager. */
	payload: (data: wsMessagePayload, ws: webSocketManager) => void;
};
