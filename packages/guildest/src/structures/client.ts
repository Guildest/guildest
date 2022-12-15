import {
	ChannelRouter,
	DocsRouter,
	ForumTopicCommentRouter,
	ForumTopicRouter,
	ListItemRouter,
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
	restForumTopicUpdatePayload,
	restDocsPayload,
} from '@guildest/api-typings';
import { ClientUser, User } from './users';
import { gateawayHandler } from '../handlers/gateaway';
import { Channel } from './channels';
import { Server, Member, MemberBan } from './servers';
import { Message } from './messages';
import { ForumTopic, ForumTopicComment } from './forums';
import { GuildedAPIError } from '../constants/errors';
import { ListItem } from './listItems';
import { Doc } from './docs';

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
		forumTopicComments: new ForumTopicCommentRouter(this.rest),
		listItems: new ListItemRouter(this.rest),
		docs: new DocsRouter(this.rest),
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
		let raw = this.getChannel(channelId);
		return await this.router.channels
			.fetch(channelId)
			.then((res) => {
				if (!raw) return new Channel(this, res);
				else raw.__update(res);
				return raw;
			})
			.then((cH) => {
				if (cache) this.__collections.add(channelId, cH, true);
				return cH;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async createRESTChannel(payload: restCreateChannelPayload): Promise<Channel> {
		return await this.router.channels
			.create(payload)
			.then((res) => new Channel(this, res))
			.then((cH) => {
				this.__collections.add(cH.id, cH);
				return cH;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async editRESTChannel(channelId: string, payload: restUpdateChannelPayload): Promise<Channel> {
		const raw = this.getChannel(channelId);
		return await this.router.channels
			.update(channelId, payload)
			.then((res) => {
				if (!raw) return new Channel(this, res);
				else raw.__update(res);
				return raw;
			})
			.then((cH) => {
				this.__collections.add(cH.id, cH, true);
				return cH;
			})
			.catch((err) => {
				this.emit('error', err);
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
				throw err;
			});
	}

	getServer(serverId: string): Server | undefined {
		if (serverId && this.__collections.has(serverId))
			return this.__collections.get(serverId) as Server;
		else return undefined;
	}

	async getRESTServer(serverId: string, cache = true): Promise<Server> {
		let raw = this.getServer(serverId);
		return await this.router.servers
			.fetch(serverId)
			.then((res) => {
				if (!raw) return new Server(this, res);
				else raw.__update(res);
				return raw;
			})
			.then((sR) => {
				if (cache) this.__collections.add(serverId, sR, true);
				return sR;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	getChatMessages(channelId: string): Collection<string, Message> | undefined {
		const channel = this.getChannel(channelId);
		if (!channel) return undefined;
		else return channel.messages;
	}

	getChatMessage(channelId: string, messageId: string): Message | undefined {
		const channel = this.getChannel(channelId);
		if (!channel) return undefined;
		else return channel.messages.get(messageId);
	}

	async getRESTChatMessages(channelId: string, cache = true): Promise<Array<Message>> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId)),
			raw: Message | undefined;
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.messages
			.fetchAll(channelId)
			.then((res) =>
				res.map((msg) => {
					raw = this.getChatMessage(channelId, msg.id);
					if (!raw) raw = new Message(this, msg);
					else raw.__update(msg);
					if (cache && channel) channel.messages.add(raw.id, raw, true);
					return raw;
				}),
			)
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async getRESTChatMessage(channelId: string, messageId: string, cache = true): Promise<Message> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId)),
			raw = this.getChatMessage(channelId, messageId);
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.messages
			.fetch(channelId, messageId)
			.then((res) => {
				if (!raw) raw = new Message(this, res);
				else raw.__update(res);
				if (cache && channel) channel.messages.add(raw.id, raw, true);
				return raw;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async createRESTChatMessage(
		channelId: string,
		payload: restChannelMessageCreatePayload,
	): Promise<Message> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, payload } });
		return await this.router.messages
			.create(channelId, payload)
			.then((res) => new Message(this, res))
			.then((msg) => {
				channel?.messages.add(msg.id, msg, true);
				return msg;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async editRESTChatMessage(
		channelId: string,
		messageId: string,
		payload: restChannelMessageEditPayload,
	): Promise<Message> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel)
			throw new GuildedAPIError('invalid_channel', {
				meta: { channelId, messageId, payload },
			});
		const raw = this.getChatMessage(channelId, messageId);
		return await this.router.messages
			.update(channelId, messageId, payload)
			.then((res) => {
				if (!raw) return new Message(this, res);
				else raw.__update(res);
				return raw;
			})
			.then((msg) => {
				channel.messages.add(messageId, msg, true);
				return msg;
			})
			.catch((err) => {
				this.emit('error', err);

				throw err;
			});
	}

	async deleteRESTChatMessage(channelId: string, messageId: string): Promise<boolean> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, messageId } });
		return await this.router.messages
			.delete(channelId, messageId)
			.then(() => channel.messages.delete(messageId))
			.then(() => true)
			.catch((err) => {
				this.emit('error', err);
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
		let server = this.getServer(serverId) ?? (await this.getRESTServer(serverId)),
			raw: Member | undefined;
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId } });
		return await this.router.members
			.fetchAll(serverId)
			.then((res) =>
				res.map((mem) => {
					raw = this.getServerMember(serverId, mem.user.id);
					if (!raw) raw = new Member(this, mem);
					else raw.__update(mem);
					if (cache) server.members.add(raw.id, raw, true);
					return raw;
				}),
			)
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async getRESTServerMember(serverId: string, userId: string, cache = true): Promise<Member> {
		let server = this.getServer(serverId) ?? (await this.getRESTServer(serverId)),
			raw = this.getServerMember(serverId, userId);
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId, userId } });
		return await this.router.members
			.fetch(serverId, userId)
			.then((res) => {
				if (!raw) raw = new Member(this, res);
				else raw.__update(res);
				if (cache) server.members.add(raw.id, raw, true);
				return raw;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async editRESTServerMemberNickname(
		serverId: string,
		userId: string,
		nickname: string,
	): Promise<Member> {
		let member =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		if (!member)
			throw new GuildedAPIError('invalid_server_member', {
				meta: { serverId, userId, nickname },
			});
		return await this.router.members
			.update(serverId, userId, { nickname: nickname })
			.then(() => {
				member.__update({ nickname: nickname });
				return member;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async deleteRESTServerMemberNickname(serverId: string, userId: string): Promise<Member> {
		let member =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		if (!member)
			throw new GuildedAPIError('invalid_server_member', { meta: { serverId, userId } });
		return await this.router.members
			.delete(serverId, userId)
			.then(() => {
				member.__update({ nickname: undefined });
				return member;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async kickRESTServerMember(serverId: string, userId: string): Promise<boolean> {
		let server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId, userId } });
		return await this.router.members
			.kick(serverId, userId)
			.then(() => {
				server.members.delete(userId);
				return true;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	getServerMemberBans(serverId: string): Collection<string, MemberBan> | undefined {
		const server = this.getServer(serverId);
		if (!server) return undefined;
		else return server.bans;
	}

	getServerMemberBan(serverId: string, userId: string): MemberBan | undefined {
		const server = this.getServer(serverId);
		if (!server) return undefined;
		else return server.bans.get(userId);
	}

	async getRESTServerMemberBans(serverId: string, cache = true): Promise<Array<MemberBan>> {
		let server = this.getServer(serverId) ?? (await this.getRESTServer(serverId)),
			raw: MemberBan | undefined;
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId } });
		return await this.router.bans
			.fetchAll(serverId)
			.then((res) =>
				res.map((ban) => {
					raw = this.getServerMemberBan(serverId, ban.user.id);
					if (!raw) raw = new MemberBan(this, ban);
					else raw.__update(ban);
					if (cache && server) server.bans.add(raw.id, raw);
					return raw;
				}),
			)
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async getRESTServerMemberBan(
		serverId: string,
		userId: string,
		cache = true,
	): Promise<MemberBan> {
		let server = this.getServer(serverId) ?? (await this.getRESTServer(serverId)),
			raw = this.getServerMemberBan(serverId, userId);
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId } });
		return await this.router.bans
			.fetch(serverId, userId)
			.then((res) => {
				if (!raw) raw = new MemberBan(this, res);
				else raw.__update(res);
				if (cache && server) server.bans.add(raw.id, raw);
				return raw;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async createRESTServerMemberBan(
		serverId: string,
		userId: string,
		reason?: string,
	): Promise<MemberBan> {
		let server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId } });
		return await this.router.bans
			.create(serverId, userId, { reason: reason })
			.then((res) => new MemberBan(this, res))
			.then((ban) => {
				server.bans.add(ban.id, ban, true);
				return ban;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async deleteRESTServerMemberBans(serverId: string, userId: string): Promise<boolean> {
		let server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId } });
		return await this.router.bans
			.delete(serverId, userId)
			.then(() => {
				server.bans.delete(userId);
				return true;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	getForumTopics(channelId: string): Collection<string, ForumTopic> | undefined {
		const channel = this.getChannel(channelId);
		if (!channel) return undefined;
		else return channel.forumTopics;
	}

	getForumTopic(channelId: string, forumTopicId: string): ForumTopic | undefined {
		const channel = this.getChannel(channelId);
		if (!channel) return undefined;
		else return channel.forumTopics.get(forumTopicId);
	}

	async getRESTForumTopics(
		channelId: string,
		query: restForumTopicsQueryParams,
		cache = true,
	): Promise<Array<ForumTopic>> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId)),
			raw: ForumTopic | undefined;
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId, query } });
		return await this.router.forumTopics
			.fetchAll(channelId, query)
			.then((res) =>
				res.map((fT) => {
					raw = this.getForumTopic(channelId, fT.id);
					if (!raw) raw = new ForumTopic(this, fT);
					else raw.__update(fT);
					if (cache && channel) channel.forumTopics.add(raw.id, raw);
					return raw;
				}),
			)
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async getRESTForumTopic(
		channelId: string,
		forumTopicId: string,
		cache = true,
	): Promise<ForumTopic> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId)),
			raw = this.getForumTopic(channelId, forumTopicId);
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopics
			.fetch(channelId, forumTopicId)
			.then((res) => {
				if (!raw) raw = new ForumTopic(this, res);
				else raw.__update(res);
				if (cache && channel) channel.forumTopics.add(raw.id, raw);
				return raw;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async createRESTForumTopic(
		channelId: string,
		payload: restForumTopicCreatePayload,
		cache = true,
	): Promise<ForumTopic> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, payload } });
		return await this.router.forumTopics
			.create(channelId, payload)
			.then((res) => new ForumTopic(this, res))
			.then((fT) => {
				if (cache && channel) channel.forumTopics.add(fT.id, fT);
				return fT;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async editRESTForumTopic(
		channelId: string,
		forumTopicId: string,
		payload: restForumTopicUpdatePayload,
	): Promise<ForumTopic> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId)),
			raw = this.getForumTopic(channelId, forumTopicId);
		if (!channel)
			throw new GuildedAPIError('invalid_channel', {
				meta: { channelId, forumTopicId, payload },
			});
		return await this.router.forumTopics
			.update(channelId, forumTopicId, payload)
			.then((res) => {
				if (!raw) raw = new ForumTopic(this, res);
				else raw.__update(res);
				channel.forumTopics.add(raw.id, raw, true);
				return raw;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async deleteRESTForumTopic(channelId: string, forumTopicId: string): Promise<boolean> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopics
			.delete(channelId, forumTopicId)
			.then(() => {
				channel.forumTopics.delete(forumTopicId);
				return true;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async pinRESTForumTopic(channelId: string, forumTopicId: string): Promise<ForumTopic> {
		let forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopics
			.pin(channelId, forumTopicId)
			.then(() => {
				forumTopic.__update({ isPinned: true });
				return forumTopic;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async unpinRESTForumTopic(channelId: string, forumTopicId: string): Promise<ForumTopic> {
		let forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopics
			.unpin(channelId, forumTopicId)
			.then(() => {
				forumTopic.__update({ isPinned: false });
				return forumTopic;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async lockRESTForumTopic(channelId: string, forumTopicId: string): Promise<ForumTopic> {
		let forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopics
			.lock(channelId, forumTopicId)
			.then(() => {
				forumTopic.__update({ isLocked: true });
				return forumTopic;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async unlockRESTForumTopic(channelId: string, forumTopicId: string): Promise<ForumTopic> {
		let forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopics
			.unlock(channelId, forumTopicId)
			.then(() => {
				forumTopic.__update({ isLocked: false });
				return forumTopic;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	getForumTopicComments(
		channelId: string,
		forumTopicId: string,
	): Collection<string, ForumTopicComment> | undefined {
		const forumTopic = this.getForumTopic(channelId, forumTopicId);
		if (!forumTopic) return undefined;
		else return forumTopic.comments;
	}

	getForumTopicComment(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
	): ForumTopicComment | undefined {
		const forumTopic = this.getForumTopic(channelId, forumTopicId);
		if (!forumTopic) return undefined;
		else return forumTopic.comments.get(forumTopicCommentId);
	}

	async getRESTForumTopicComments(
		channelId: string,
		forumTopicId: string,
		cache = true,
	): Promise<Array<ForumTopicComment>> {
		let forumTopic =
				this.getForumTopic(channelId, forumTopicId) ??
				(await this.getRESTForumTopic(channelId, forumTopicId)),
			raw: ForumTopicComment | undefined;
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopicComments
			.fetchAll(channelId, forumTopicId)
			.then((res) =>
				res.map((fTc) => {
					raw = this.getForumTopicComment(channelId, forumTopicId, fTc.id);
					if (!raw) raw = new ForumTopicComment(this, fTc);
					else raw.__update(fTc);
					if (cache && forumTopic) forumTopic.comments.add(raw.id, raw, true);
					return raw;
				}),
			)
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async getRESTForumTopicComment(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
		cache = true,
	): Promise<ForumTopicComment> {
		let forumTopic =
				this.getForumTopic(channelId, forumTopicId) ??
				(await this.getRESTForumTopic(channelId, forumTopicId)),
			raw = this.getForumTopicComment(channelId, forumTopicId, forumTopicCommentId);
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopicComments
			.fetch(channelId, forumTopicId, forumTopicCommentId)
			.then((res) => {
				if (!raw) raw = new ForumTopicComment(this, res);
				else raw.__update(res);
				if (cache && forumTopic) forumTopic.comments.add(raw.id, raw, true);
				return raw;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async createRESTForumTopicComment(
		channelId: string,
		forumTopicId: string,
		content: string,
	): Promise<ForumTopicComment> {
		let forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', {
				meta: { channelId, forumTopicId, content },
			});
		return await this.router.forumTopicComments
			.create(channelId, forumTopicId, { content: content })
			.then((res) => new ForumTopicComment(this, res))
			.then((fTc) => {
				forumTopic.comments.add(fTc.id, fTc, true);
				return fTc;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async editRESTForumTopicComment(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
		content: string,
	): Promise<ForumTopicComment> {
		let forumTopic =
				this.getForumTopic(channelId, forumTopicId) ??
				(await this.getRESTForumTopic(channelId, forumTopicId)),
			raw = this.getForumTopicComment(channelId, forumTopicId, forumTopicCommentId);
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', {
				meta: { channelId, forumTopicId, forumTopicCommentId, content },
			});
		return await this.router.forumTopicComments
			.update(channelId, forumTopicId, forumTopicCommentId, { content: content })
			.then((res) => {
				if (!raw) raw = new ForumTopicComment(this, res);
				else raw.__update(res);
				forumTopic.comments.add(raw.id, raw, true);
				return raw;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async deleteRESTForumTopicComment(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
	): Promise<Boolean> {
		let forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', {
				meta: { channelId, forumTopicId, forumTopicCommentId },
			});
		return await this.router.forumTopicComments
			.delete(channelId, forumTopicId, forumTopicCommentId)
			.then(() => {
				forumTopic.comments.delete(forumTopicCommentId);
				return true;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	getListItems(channelId: string): Collection<string, ListItem> | undefined {
		const channel = this.getChannel(channelId);
		if (!channel) return undefined;
		else return channel.listItems;
	}

	getListItem(channelId: string, listItemId: string): ListItem | undefined {
		const channel = this.getChannel(channelId);
		if (!channel) return undefined;
		else return channel.listItems.get(listItemId);
	}

	async getRESTListItems(channelId: string, cache = true): Promise<Array<ListItem>> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId)),
			raw: ListItem | undefined;
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.listItems
			.fetchAll(channelId)
			.then((res) =>
				res.map((liT) => {
					raw = this.getListItem(channelId, liT.id);
					if (!raw) raw = new ListItem(this, liT);
					else raw.__update(liT);
					if (cache) channel.listItems.add(raw.id, raw, true);
					return raw;
				}),
			)
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async getRESTListItem(channelId: string, listItemId: string, cache = true): Promise<ListItem> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId)),
			raw = this.getListItem(channelId, listItemId);
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.listItems
			.fetch(channelId, listItemId)
			.then((res) => {
				if (!raw) raw = new ListItem(this, res);
				else raw.__update(res);
				if (cache) channel.listItems.add(raw.id, raw, true);
				return raw;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async createRESTListItem(
		channelId: string,
		message: string,
		note?: { content: string },
	): Promise<ListItem> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.listItems
			.create(channelId, { message: message, note: note })
			.then((res) => new ListItem(this, res))
			.then((lIt) => {
				channel.listItems.add(lIt.id, lIt, true);
				return lIt;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async editRESTListItem(
		channelId: string,
		listItemId: string,
		message: string,
		note?: { content: string },
	): Promise<ListItem> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId)),
			raw = this.getListItem(channelId, listItemId);
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.listItems
			.update(channelId, listItemId, { message: message, note: note })
			.then((res) => {
				if (!raw) raw = new ListItem(this, res);
				else raw.__update(res);
				channel.listItems.add(raw.id, raw, true);
				return raw;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async deleteRESTListItem(channelId: string, listItemId: string): Promise<Boolean> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.listItems
			.delete(channelId, listItemId)
			.then(() => {
				channel.listItems.delete(listItemId);
				return true;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async completeRESTListItem(channelId: string, listItemId: string): Promise<ListItem> {
		let raw =
			this.getListItem(channelId, listItemId) ??
			(await this.getRESTListItem(channelId, listItemId));
		if (!raw)
			throw new GuildedAPIError('invalid_list_item', { meta: { channelId, listItemId } });
		return await this.router.listItems
			.complete(channelId, listItemId)
			.then(() => {
				raw.__update({ completedAt: new Date().toISOString(), completedBy: this.user?.id });
				return raw;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	async uncompleteRESTListItem(channelId: string, listItemId: string): Promise<ListItem> {
		let raw =
			this.getListItem(channelId, listItemId) ??
			(await this.getRESTListItem(channelId, listItemId));
		if (!raw)
			throw new GuildedAPIError('invalid_list_item', { meta: { channelId, listItemId } });
		return await this.router.listItems
			.uncomplete(channelId, listItemId)
			.then(() => {
				raw.__update({ completedAt: undefined, completedBy: undefined });
				return raw;
			})
			.catch((err) => {
				this.emit('error', err);
				throw err;
			});
	}

	getDocs(channelId: string): Collection<string, Doc> | undefined {
		const channel = this.getChannel(channelId);
		if (!channel) return undefined;
		else return channel.docs;
	}

	getDoc(channelId: string, docId: string): Doc | undefined {
		const channel = this.getChannel(channelId);
		if (!channel) return undefined;
		else return channel.docs.get(docId);
	}

	async getRESTDocs(
		channelId: string,
		query?: restDocsPayload,
		cache = true,
	): Promise<Array<Doc>> {
		let channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId)),
			raw: Doc | undefined;
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.docs
			.fetchAll(channelId, query)
			.then((res) =>
				res.map((doc) => {
					raw = this.getDoc(channelId, doc.id);
					if (!raw) raw = new Doc(this, doc);
					else raw.__update(doc);
					if (cache) channel.docs.add(raw.id, raw, true);
					return raw;
				}),
			)
			.catch((err) => {
				this.emit('error', err);
				throw err;
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
