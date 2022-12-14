import {
	ChannelRouter,
	MemberRouter,
	MessageRouter,
	restManager,
	restOptions,
	ServerRouter,
} from '@guildest/rest';
import { webSocketManager, wsOptions } from '@guildest/ws';
import EventEmitter from 'events';
import { Collection } from '@guildest/collection';
import {
	restUpdateChannelPayload,
	restCreateChannelPayload,
	restChannelMessageCreatePayload,
	ApiMessage,
	restChannelMessageEditPayload,
	restServerMemberUpdatePayload,
	restServerMemberUpdateResponse,
	ApiServerMember,
} from '@guildest/api-typings';
import { ClientUser, User } from './users';
import { gateawayHandler } from '../handlers/gateaway';
import { Channel } from './channels';
import { Server, Member } from './servers';
import { Message } from './messages';

export class Client extends EventEmitter {
	user?: ClientUser;
	readyTimestamp?: number;

	ws: webSocketManager = new webSocketManager({ token: this.token, ...this.option.ws });
	rest: restManager = new restManager({ token: this.token, ...this.option.rest });
	gateawayHandler: gateawayHandler = new gateawayHandler(this);

	collections = {
		channel: new Collection<string, Channel>(),
		server: new Collection<string, Server>(),
		users: new Collection<string, User>(),
	};

	router = {
		servers: new ServerRouter(this.rest),
		channels: new ChannelRouter(this.rest),
		messages: new MessageRouter(this.rest),
		members: new MemberRouter(this.rest),
	};

	constructor(readonly token: string, public readonly option: ClientOption) {
		super();
	}

	async connect(token: string = this.token, force = false) {
		if (force) this.ws = new webSocketManager({ token: token, ...this.option.ws });
		this.ws.emitter.on('ready', (user) => {
			this.user = new ClientUser(this, user);
			this.readyTimestamp = Date.now();
			this.emit('ready');
		});

		this.ws.emitter.on('gateaway', (eNm, eVp) => this.gateawayHandler.events[eNm](eVp));
	}

	getChannel(channelId: string): Channel | undefined {
		if (channelId && this.collections.channel.has(channelId))
			return this.collections.channel.get(channelId);
		else return undefined;
	}

	async createRESTChannel(
		payload: restCreateChannelPayload,
		cache: boolean = true,
	): Promise<Channel> {
		let channel = await this.router.channels
			.create(payload)
			.then((res) => new Channel(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache && channel.id) this.collections.channel.add(channel.id, channel, true);
		return channel;
	}

	async getRESTChannel(channelId: string, cache: boolean = true): Promise<Channel> {
		let channel = await this.router.channels
			.fetch(channelId)
			.then((res) => new Channel(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache) this.collections.channel.add(channelId, channel, true);
		return channel;
	}

	async editRESTChannel(
		channelId: string,
		payload: restUpdateChannelPayload,
		cache: boolean = true,
	): Promise<Channel> {
		let channel = await this.router.channels
			.update(channelId, payload)
			.then((res) => new Channel(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache) this.collections.channel.add(channelId, channel, true);
		return channel;
	}

	async deleteRESTChannel(channelId: string): Promise<Boolean> {
		return await this.router.channels
			.delete(channelId)
			.then(() => this.collections.channel.delete(channelId))
			.then(() => true)
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	getServer(serverId: string): Server | undefined {
		if (serverId && this.collections.server.has(serverId))
			return this.collections.server.get(serverId);
		else return undefined;
	}

	async getRESTServer(serverId: string, cache: boolean = true): Promise<Server> {
		let server = await this.router.servers
			.fetch(serverId)
			.then((res) => new Server(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache) this.collections.server.add(serverId, server, true);
		return server;
	}

	async createRESTChatMessage(
		channelId: string,
		payload: restChannelMessageCreatePayload,
		cache: boolean = true,
	): Promise<Message> {
		let channel = this.getChannel(channelId);
		if (!channel) channel = await this.getRESTChannel(channelId);
		let message = await this.router.messages
			.create(channelId, payload)
			.then((res) => new Message(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache && channel) channel.messages.add(message.id, message, true);
		return message;
	}

	async getRESTChatMessages(channelId: string, cache: boolean = true): Promise<Array<Message>> {
		let channel = this.getChannel(channelId);
		if (!channel) channel = await this.getRESTChannel(channelId);
		let messages = await this.router.messages
			.fetch<Array<ApiMessage>>(channelId)
			.then((res) => res.map((msg) => new Message(this, msg)))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache && channel) messages.forEach((msg) => channel!.messages.add(msg.id, msg, true));
		return messages;
	}

	async getRESTChatMessage(
		channelId: string,
		messageId: string,
		cache: boolean = true,
	): Promise<Message> {
		let channel = this.getChannel(channelId);
		if (!channel) channel = await this.getRESTChannel(channelId);
		let message = await this.router.messages
			.fetch<ApiMessage>(channelId, messageId)
			.then((res) => new Message(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache && channel) channel.messages.add(message.id, message, true);
		return message;
	}

	async editRESTChatMessage(
		channelId: string,
		messageId: string,
		payload: restChannelMessageEditPayload,
		cache: boolean = true,
	): Promise<Message> {
		let channel = this.getChannel(channelId);
		if (!channel) channel = await this.getRESTChannel(channelId);
		let message = await this.router.messages
			.update(channelId, messageId, payload)
			.then((res) => new Message(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache && channel) channel.messages.add(message.id, message, true);
		return message;
	}

	async deleteRESTChatMessage(channelId: string, messageId: string): Promise<Boolean> {
		let channel = this.getChannel(channelId);
		await this.router.messages
			.delete(channelId, messageId)
			.then(() => true)
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (channel) channel.messages.delete(messageId);
		return true;
	}

	getServerMember(serverId: string, userId: string) {
		let server = this.getServer(serverId);
		if (!server) return undefined;
		else if (!(userId && server.members.has(userId))) return undefined;
		else return server.members.get(userId);
	}

	async getRESTServerMember(serverId: string, userId: string) {
		let server = this.getServer(serverId);
		if (!server) server = await this.getRESTServer(serverId);
		let member = await this.router.members
			.fetch<ApiServerMember>(serverId, userId)
			.then((res) => new Member(this, res));
	}

	async editRESTMemberNickname(
		serverId: string,
		userId: string,
		nickname: string,
		cache: boolean = true,
	) {
		let server = this.getServer(serverId);
		if (!server) server = await this.getRESTServer(serverId);
		let member = this.getServerMember(serverId, userId);
		if (!member) member = await this.getRESTServerMember(serverId, userId);
		let member = await this.router.members
			.update(serverId, userId, { nickname: nickname })
			.then((res) => res.nickname);
	}
}

export interface ClientOption {
	rest?: restOptions;
	ws?: wsOptions;
	caches?: {
		messages: false;
	};
}
