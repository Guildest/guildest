import {
	ChannelRouter,
	ForumTopicRouter,
	MemberRouter,
	MessageRouter,
	restManager,
	restOptions,
	ServerBansRouter,
	ServerRouter,
} from '@guildest/rest';
import { webSocketManager, wsOptions } from '@guildest/ws';
import EventEmitter from 'events';
import { Collection } from '@guildest/collection';
import {
	restUpdateChannelPayload,
	restCreateChannelPayload,
	restChannelMessageCreatePayload,
	restChannelMessageEditPayload,
	restForumTopicCreatePayload,
	restForumTopicsQueryParams,
} from '@guildest/api-typings';
import { ClientUser, User } from './users';
import { gateawayHandler } from '../handlers/gateaway';
import { Channel } from './channels';
import { Server, Member, MemberBan } from './servers';
import { Message } from './messages';
import { ForumTopic } from './forums';

export class Client extends EventEmitter {
	user?: ClientUser;
	readyTimestamp?: number;

	ws: webSocketManager = new webSocketManager({ token: this.token, ...this.option.ws });
	rest: restManager = new restManager({ token: this.token, ...this.option.rest });
	gateawayHandler: gateawayHandler = new gateawayHandler(this);

	__collections = new Collection<string, User | Channel | Server>();

	router = {
		servers: new ServerRouter(this.rest),
		channels: new ChannelRouter(this.rest),
		messages: new MessageRouter(this.rest),
		members: new MemberRouter(this.rest),
		bans: new ServerBansRouter(this.rest),
		forumTopics: new ForumTopicRouter(this.rest),
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
		if (channelId && this.__collections.has(channelId))
			return this.__collections.get(channelId) as Channel;
		else return undefined;
	}

	async getRESTChannel(channelId: string, cache = true): Promise<Channel> {
		const channel = await this.router.channels
			.fetch(channelId)
			.then((res) => new Channel(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache) this.__collections.add(channelId, channel, true);
		return channel;
	}

	async createRESTChannel(payload: restCreateChannelPayload): Promise<Channel> {
		return await this.router.channels
			.create(payload)
			.then((res) => new Channel(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	async editRESTChannel(channelId: string, payload: restUpdateChannelPayload): Promise<Channel> {
		return await this.router.channels
			.update(channelId, payload)
			.then((res) => new Channel(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	async deleteRESTChannel(channelId: string): Promise<boolean> {
		return await this.router.channels
			.delete(channelId)
			.then(() => this.__collections.delete(channelId))
			.then(() => true)
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	getServer(serverId: string): Server | undefined {
		if (serverId && this.__collections.has(serverId))
			return this.__collections.get(serverId) as Server;
		else return undefined;
	}

	async getRESTServer(serverId: string, cache = true): Promise<Server> {
		const server = await this.router.servers
			.fetch(serverId)
			.then((res) => new Server(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache) this.__collections.add(serverId, server, true);
		return server;
	}

	async createRESTChatMessage(
		channelId: string,
		payload: restChannelMessageCreatePayload,
	): Promise<Message> {
		return await this.router.messages
			.create(channelId, payload)
			.then((res) => new Message(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	async getRESTChatMessages(channelId: string, cache = true): Promise<Array<Message>> {
		let channel = this.getChannel(channelId);
		if (!channel) channel = await this.getRESTChannel(channelId);
		const messages = await this.router.messages
			.fetchAll(channelId)
			.then((res) => res.map((msg) => new Message(this, msg)))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache && channel) messages.forEach((msg) => channel!.messages.add(msg.id, msg, true));
		return messages;
	}

	async getRESTChatMessage(channelId: string, messageId: string, cache = true): Promise<Message> {
		let channel = this.getChannel(channelId);
		if (!channel) channel = await this.getRESTChannel(channelId);
		const message = await this.router.messages
			.fetch(channelId, messageId)
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
	): Promise<Message> {
		return await this.router.messages
			.update(channelId, messageId, payload)
			.then((res) => new Message(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	async deleteRESTChatMessage(channelId: string, messageId: string): Promise<boolean> {
		return await this.router.messages
			.delete(channelId, messageId)
			.then(() => true)
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	getServerMembers(serverId: string): Collection<string, Member> | undefined {
		const server = this.getServer(serverId);
		if (!server) return undefined;
		else return server.members;
	}

	getServerMember(serverId: string, userId: string): Member | undefined {
		const server = this.getServer(serverId);
		if (!server) return undefined;
		else if (!(userId && server.members.has(userId))) return undefined;
		else return server.members.get(userId);
	}

	async getRESTServerMembers(serverId: string, cache = true): Promise<Array<Member>> {
		let server = this.getServer(serverId);
		if (!server) server = await this.getRESTServer(serverId);
		const members = await this.router.members
			.fetchAll(serverId)
			.then((res) => res.map((mem) => new Member(this, mem)))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache && server) members.map((mem) => server!.members.add(mem.id, mem));
		return members;
	}

	async getRESTServerMember(serverId: string, userId: string, cache = true): Promise<Member> {
		let server = this.getServer(serverId);
		if (!server) server = await this.getRESTServer(serverId);
		const member = await this.router.members
			.fetch(serverId, userId)
			.then((res) => new Member(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
		if (cache && server) server.members.add(userId, member);
		return member;
	}

	async editRESTServerMemberNickname(
		serverId: string,
		userId: string,
		nickname: string,
	): Promise<boolean> {
		return await this.router.members
			.update(serverId, userId, { nickname: nickname })
			.then(() => true)
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	async deleteRESTServerMemberNickname(serverId: string, userId: string): Promise<boolean> {
		return await this.router.members.delete(serverId, userId).catch((err) => {
			this.emit('error', err);
			this.emit('restError', err);
			throw err;
		});
	}

	async kickRESTServerMember(serverId: string, userId: string): Promise<boolean> {
		return await this.router.members
			.kick(serverId, userId)
			.then(() => true)
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	async createRESTServerMemberBan(
		serverId: string,
		userId: string,
		reason?: string,
	): Promise<MemberBan> {
		return await this.router.bans
			.create(serverId, userId, { reason: reason })
			.then((res) => new MemberBan(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	async getRESTServerMemberBan(serverId: string, userId: string): Promise<MemberBan> {
		return await this.router.bans
			.fetch(serverId, userId)
			.then((res) => new MemberBan(this, res))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	async getRESTServerMemberBans(serverId: string): Promise<Array<MemberBan>> {
		return await this.router.bans
			.fetchAll(serverId)
			.then((res) => res.map((ban) => new MemberBan(this, ban)))
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	async deleteRESTServerMemberBans(serverId: string, userId: string): Promise<boolean> {
		return await this.router.bans
			.delete(serverId, userId)
			.then(() => true)
			.catch((err) => {
				this.emit('error', err);
				this.emit('restError', err);
				throw err;
			});
	}

	async getRESTForumTopics(
		channelId: string,
		query: restForumTopicsQueryParams,
	): Promise<Array<ForumTopic>> {
		return await this.router.forumTopics
			.fetchAll(channelId, query)
			.then((res) => res.map((fT) => new ForumTopic(this, fT)));
	}

	async createRESTForumTopic(
		channelId: string,
		payload: restForumTopicCreatePayload,
	): Promise<ForumTopic> {
		return await this.router.forumTopics
			.create(channelId, payload)
			.then((res) => new ForumTopic(this, res));
	}
}

export interface ClientOption {
	rest?: restOptions;
	ws?: wsOptions;
	caches?: {
		messages: false;
	};
}
