import {
	CalendarEventRouter,
	CalendarEventRsvpRouter,
	ChannelRouter,
	DocsRouter,
	ForumTopicCommentRouter,
	ForumTopicRouter,
	GroupMembershipRouter,
	ListItemRouter,
	MemberRouter,
	MessageRouter,
	ReactionRouter,
	restManager,
	restOptions,
	RoleMembershipRouter,
	ServerBansRouter,
	ServerRouter,
	ServerXPRouter,
	WebhookRouter,
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
	restDocsQueryParams,
	restCalendarEventPayload,
	restCalendarEventRsvpPayload,
	ApiBaseSocialLinks,
	restWebhookUpdatePayload,
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
import { CalendarEvent, CalendarEventRsvp } from './calenderEvents';
import { BaseReaction } from './base';
import { Webhook } from './webhooks';

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
		calenderEvents: new CalendarEventRouter(this.rest),
		calendarEventRsvps: new CalendarEventRsvpRouter(this.rest),
		reactions: new ReactionRouter(this.rest),
		serverXps: new ServerXPRouter(this.rest),
		groupMemberships: new GroupMembershipRouter(this.rest),
		roleMemberships: new RoleMembershipRouter(this.rest),
		webhooks: new WebhookRouter(this.rest),
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
		const raw = this.getChannel(channelId);
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
			});
	}

	async createRESTChannel(payload: restCreateChannelPayload): Promise<Channel> {
		return await this.router.channels
			.create(payload)
			.then((res) => new Channel(this, res))
			.then((cH) => {
				this.__collections.add(cH.id, cH);
				return cH;
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
			});
	}

	async deleteRESTChannel(channelId: string): Promise<boolean> {
		return await this.router.channels
			.delete(channelId)
			.then(() => this.__collections.delete(channelId))
			.then(() => true);
	}

	getServer(serverId: string): Server | undefined {
		if (serverId && this.__collections.has(serverId))
			return this.__collections.get(serverId) as Server;
		else return undefined;
	}

	async getRESTServer(serverId: string, cache = true): Promise<Server> {
		const raw = this.getServer(serverId);
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
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw: Message | undefined;
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.messages.fetchAll(channelId).then((res) =>
			res.map((msg) => {
				raw = this.getChatMessage(channelId, msg.id);
				if (!raw) raw = new Message(this, msg);
				else raw.__update(msg);
				if (cache && channel) channel.messages.add(raw.id, raw, true);
				return raw;
			}),
		);
	}

	async getRESTChatMessage(channelId: string, messageId: string, cache = true): Promise<Message> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw = this.getChatMessage(channelId, messageId);
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.messages.fetch(channelId, messageId).then((res) => {
			if (!raw) raw = new Message(this, res);
			else raw.__update(res);
			if (cache && channel) channel.messages.add(raw.id, raw, true);
			return raw;
		});
	}

	async createRESTChatMessage(
		channelId: string,
		payload: restChannelMessageCreatePayload,
	): Promise<Message> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, payload } });
		return await this.router.messages
			.create(channelId, payload)
			.then((res) => new Message(this, res))
			.then((msg) => {
				channel?.messages.add(msg.id, msg, true);
				return msg;
			});
	}

	async editRESTChatMessage(
		channelId: string,
		messageId: string,
		payload: restChannelMessageEditPayload,
	): Promise<Message> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
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
			});
	}

	async deleteRESTChatMessage(channelId: string, messageId: string): Promise<boolean> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, messageId } });
		return await this.router.messages
			.delete(channelId, messageId)
			.then(() => channel.messages.delete(messageId))
			.then(() => true);
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
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		let raw: Member | undefined;
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId } });
		return await this.router.members.fetchAll(serverId).then((res) =>
			res.map((mem) => {
				raw = this.getServerMember(serverId, mem.user.id);
				if (!raw) raw = new Member(this, mem);
				else raw.__update(mem);
				if (cache) server.members.add(raw.id, raw, true);
				return raw;
			}),
		);
	}

	async getRESTServerMember(serverId: string, userId: string, cache = true): Promise<Member> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		let raw = this.getServerMember(serverId, userId);
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId, userId } });
		return await this.router.members.fetch(serverId, userId).then((res) => {
			if (!raw) raw = new Member(this, res);
			else raw.__update(res);
			if (cache) server.members.add(raw.id, raw, true);
			return raw;
		});
	}

	async editRESTServerMemberNickname(
		serverId: string,
		userId: string,
		nickname: string,
	): Promise<Member> {
		const member =
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
			});
	}

	async deleteRESTServerMemberNickname(serverId: string, userId: string): Promise<Member> {
		const member =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		if (!member)
			throw new GuildedAPIError('invalid_server_member', { meta: { serverId, userId } });
		return await this.router.members.delete(serverId, userId).then(() => {
			member.__update({ nickname: undefined });
			return member;
		});
	}

	async kickRESTServerMember(serverId: string, userId: string): Promise<boolean> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId, userId } });
		return await this.router.members.kick(serverId, userId).then(() => {
			server.members.delete(userId);
			return true;
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
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		let raw: MemberBan | undefined;
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId } });
		return await this.router.bans.fetchAll(serverId).then((res) =>
			res.map((ban) => {
				raw = this.getServerMemberBan(serverId, ban.user.id);
				if (!raw) raw = new MemberBan(this, ban);
				else raw.__update(ban);
				if (cache && server) server.bans.add(raw.id, raw);
				return raw;
			}),
		);
	}

	async getRESTServerMemberBan(
		serverId: string,
		userId: string,
		cache = true,
	): Promise<MemberBan> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		let raw = this.getServerMemberBan(serverId, userId);
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId } });
		return await this.router.bans.fetch(serverId, userId).then((res) => {
			if (!raw) raw = new MemberBan(this, res);
			else raw.__update(res);
			if (cache && server) server.bans.add(raw.id, raw);
			return raw;
		});
	}

	async createRESTServerMemberBan(
		serverId: string,
		userId: string,
		reason?: string,
	): Promise<MemberBan> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId } });
		return await this.router.bans
			.create(serverId, userId, { reason: reason })
			.then((res) => new MemberBan(this, res))
			.then((ban) => {
				server.bans.add(ban.id, ban, true);
				return ban;
			});
	}

	async deleteRESTServerMemberBans(serverId: string, userId: string): Promise<boolean> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		if (!server) throw new GuildedAPIError('invalid_server', { meta: { serverId } });
		return await this.router.bans.delete(serverId, userId).then(() => {
			server.bans.delete(userId);
			return true;
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
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw: ForumTopic | undefined;
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId, query } });
		return await this.router.forumTopics.fetchAll(channelId, query).then((res) =>
			res.map((fT) => {
				raw = this.getForumTopic(channelId, fT.id.toString());
				if (!raw) raw = new ForumTopic(this, fT);
				else raw.__update(fT);
				if (cache && channel) channel.forumTopics.add(raw.id, raw);
				return raw;
			}),
		);
	}

	async getRESTForumTopic(
		channelId: string,
		forumTopicId: string,
		cache = true,
	): Promise<ForumTopic> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw = this.getForumTopic(channelId, forumTopicId);
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopics.fetch(channelId, forumTopicId).then((res) => {
			if (!raw) raw = new ForumTopic(this, res);
			else raw.__update(res);
			if (cache && channel) channel.forumTopics.add(raw.id, raw);
			return raw;
		});
	}

	async createRESTForumTopic(
		channelId: string,
		payload: restForumTopicCreatePayload,
		cache = true,
	): Promise<ForumTopic> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, payload } });
		return await this.router.forumTopics
			.create(channelId, payload)
			.then((res) => new ForumTopic(this, res))
			.then((fT) => {
				if (cache && channel) channel.forumTopics.add(fT.id, fT);
				return fT;
			});
	}

	async editRESTForumTopic(
		channelId: string,
		forumTopicId: string,
		payload: restForumTopicUpdatePayload,
	): Promise<ForumTopic> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw = this.getForumTopic(channelId, forumTopicId);
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
			});
	}

	async deleteRESTForumTopic(channelId: string, forumTopicId: string): Promise<boolean> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopics.delete(channelId, forumTopicId).then(() => {
			channel.forumTopics.delete(forumTopicId);
			return true;
		});
	}

	async pinRESTForumTopic(channelId: string, forumTopicId: string): Promise<ForumTopic> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopics.pin(channelId, forumTopicId).then(() => {
			forumTopic.__update({ isPinned: true });
			return forumTopic;
		});
	}

	async unpinRESTForumTopic(channelId: string, forumTopicId: string): Promise<ForumTopic> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopics.unpin(channelId, forumTopicId).then(() => {
			forumTopic.__update({ isPinned: false });
			return forumTopic;
		});
	}

	async lockRESTForumTopic(channelId: string, forumTopicId: string): Promise<ForumTopic> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopics.lock(channelId, forumTopicId).then(() => {
			forumTopic.__update({ isLocked: true });
			return forumTopic;
		});
	}

	async unlockRESTForumTopic(channelId: string, forumTopicId: string): Promise<ForumTopic> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopics.unlock(channelId, forumTopicId).then(() => {
			forumTopic.__update({ isLocked: false });
			return forumTopic;
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
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		let raw: ForumTopicComment | undefined;
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopicComments.fetchAll(channelId, forumTopicId).then((res) =>
			res.map((fTc) => {
				raw = this.getForumTopicComment(channelId, forumTopicId, fTc.id.toString());
				if (!raw) raw = new ForumTopicComment(this, fTc);
				else raw.__update(fTc);
				if (cache && forumTopic) forumTopic.comments.add(raw.id, raw, true);
				return raw;
			}),
		);
	}

	async getRESTForumTopicComment(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
		cache = true,
	): Promise<ForumTopicComment> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		let raw = this.getForumTopicComment(channelId, forumTopicId, forumTopicCommentId);
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', { meta: { channelId, forumTopicId } });
		return await this.router.forumTopicComments
			.fetch(channelId, forumTopicId, forumTopicCommentId)
			.then((res) => {
				if (!raw) raw = new ForumTopicComment(this, res);
				else raw.__update(res);
				if (cache && forumTopic) forumTopic.comments.add(raw.id, raw, true);
				return raw;
			});
	}

	async createRESTForumTopicComment(
		channelId: string,
		forumTopicId: string,
		content: string,
	): Promise<ForumTopicComment> {
		const forumTopic =
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
			});
	}

	async editRESTForumTopicComment(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
		content: string,
	): Promise<ForumTopicComment> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		let raw = this.getForumTopicComment(channelId, forumTopicId, forumTopicCommentId);
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
			});
	}

	async deleteRESTForumTopicComment(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
	): Promise<boolean> {
		const forumTopic =
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
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw: ListItem | undefined;
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.listItems.fetchAll(channelId).then((res) =>
			res.map((liT) => {
				raw = this.getListItem(channelId, liT.id);
				if (!raw) raw = new ListItem(this, liT);
				else raw.__update(liT);
				if (cache) channel.listItems.add(raw.id, raw, true);
				return raw;
			}),
		);
	}

	async getRESTListItem(channelId: string, listItemId: string, cache = true): Promise<ListItem> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw = this.getListItem(channelId, listItemId);
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.listItems.fetch(channelId, listItemId).then((res) => {
			if (!raw) raw = new ListItem(this, res);
			else raw.__update(res);
			if (cache) channel.listItems.add(raw.id, raw, true);
			return raw;
		});
	}

	async createRESTListItem(
		channelId: string,
		message: string,
		note?: { content: string },
	): Promise<ListItem> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.listItems
			.create(channelId, { message: message, note: note })
			.then((res) => new ListItem(this, res))
			.then((lIt) => {
				channel.listItems.add(lIt.id, lIt, true);
				return lIt;
			});
	}

	async editRESTListItem(
		channelId: string,
		listItemId: string,
		message: string,
		note?: { content: string },
	): Promise<ListItem> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw = this.getListItem(channelId, listItemId);
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.listItems
			.update(channelId, listItemId, { message: message, note: note })
			.then((res) => {
				if (!raw) raw = new ListItem(this, res);
				else raw.__update(res);
				channel.listItems.add(raw.id, raw, true);
				return raw;
			});
	}

	async deleteRESTListItem(channelId: string, listItemId: string): Promise<boolean> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.listItems.delete(channelId, listItemId).then(() => {
			channel.listItems.delete(listItemId);
			return true;
		});
	}

	async completeRESTListItem(channelId: string, listItemId: string): Promise<ListItem> {
		const raw =
			this.getListItem(channelId, listItemId) ??
			(await this.getRESTListItem(channelId, listItemId));
		if (!raw)
			throw new GuildedAPIError('invalid_list_item', { meta: { channelId, listItemId } });
		return await this.router.listItems.complete(channelId, listItemId).then(() => {
			raw.__update({ completedAt: new Date().toISOString(), completedBy: this.user?.id });
			return raw;
		});
	}

	async uncompleteRESTListItem(channelId: string, listItemId: string): Promise<ListItem> {
		const raw =
			this.getListItem(channelId, listItemId) ??
			(await this.getRESTListItem(channelId, listItemId));
		if (!raw)
			throw new GuildedAPIError('invalid_list_item', { meta: { channelId, listItemId } });
		return await this.router.listItems.uncomplete(channelId, listItemId).then(() => {
			raw.__update({ completedAt: undefined, completedBy: undefined });
			return raw;
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
		query?: restDocsQueryParams,
		cache = true,
	): Promise<Array<Doc>> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw: Doc | undefined;
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.docs.fetchAll(channelId, query).then((res) =>
			res.map((doc) => {
				raw = this.getDoc(channelId, doc.id.toString());
				if (!raw) raw = new Doc(this, doc);
				else raw.__update(doc);
				if (cache) channel.docs.add(raw.id, raw, true);
				return raw;
			}),
		);
	}

	async getRESTDoc(channelId: string, docId: string, cache = true): Promise<Doc> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw = this.getDoc(channelId, docId);
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.docs.fetch(channelId, docId).then((res) => {
			if (!raw) raw = new Doc(this, res);
			else raw.__update(res);
			if (cache) channel.docs.add(raw.id, raw, true);
			return raw;
		});
	}

	async createRESTDoc(channelId: string, title: string, content: string): Promise<Doc> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId } });
		return await this.router.docs
			.create(channelId, { title, content })
			.then((res) => new Doc(this, res))
			.then((doc) => {
				channel.docs.add(doc.id, doc, true);
				return doc;
			});
	}

	async editRESTDoc(
		channelId: string,
		docId: string,
		title: string,
		content: string,
	): Promise<Doc> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw = this.getDoc(channelId, docId);
		if (!channel)
			throw new GuildedAPIError('invalid_channel', {
				meta: { channelId, docId, title, content },
			});
		return await this.router.docs.update(channelId, docId, { title, content }).then((res) => {
			if (!raw) raw = new Doc(this, res);
			else raw.__update(res);
			channel.docs.add(raw.id, raw, true);
			return raw;
		});
	}

	async deleteRESTDoc(channelId: string, docId: string): Promise<boolean> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId, docId } });
		return await this.router.docs.delete(channelId, docId).then(() => {
			channel.docs.delete(docId);
			return true;
		});
	}

	getCalendarEvents(channelId: string): Collection<string, CalendarEvent> | undefined {
		const channel = this.getChannel(channelId);
		if (!channel) return undefined;
		else return channel.calenderEvents;
	}

	getCalendarEvent(channelId: string, calendarEventId: string): CalendarEvent | undefined {
		const channel = this.getChannel(channelId);
		if (!channel) return undefined;
		else return channel.calenderEvents.get(calendarEventId);
	}

	async getRESTCalendarEvents(
		channelId: string,
		query?: restCalendarEventPayload,
		cache = true,
	): Promise<Array<CalendarEvent>> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw: CalendarEvent | undefined;
		if (!channel) throw new GuildedAPIError('invalid_channel', { meta: { channelId, query } });
		return await this.router.calenderEvents.fetchAll(channelId, query).then((res) =>
			res.map((cE) => {
				raw = this.getCalendarEvent(channelId, cE.id.toString());
				if (!raw) raw = new CalendarEvent(this, cE);
				else raw.__update(cE);
				if (cache) channel.calenderEvents.add(raw.id, raw, true);
				return raw;
			}),
		);
	}

	async getRESTCalendarEvent(
		channelId: string,
		calendarEventId: string,
		cache = true,
	): Promise<CalendarEvent> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw = this.getCalendarEvent(channelId, calendarEventId);
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, calendarEventId } });
		return await this.router.calenderEvents.fetch(channelId, calendarEventId).then((res) => {
			if (!raw) raw = new CalendarEvent(this, res);
			else raw.__update(res);
			if (cache) channel.calenderEvents.add(raw.id, raw, true);
			return raw;
		});
	}

	async createRESTCalendarEvent(
		channelId: string,
		payload: restCalendarEventPayload,
	): Promise<CalendarEvent> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, payload } });
		return await this.router.calenderEvents
			.create(channelId, payload)
			.then((res) => new CalendarEvent(this, res))
			.then((cE) => {
				channel.calenderEvents.add(cE.id, cE, true);
				return cE;
			});
	}

	async editRESTCalendarEvent(
		channelId: string,
		calendarEventId: string,
		payload: restCalendarEventPayload,
	): Promise<CalendarEvent> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		let raw = this.getCalendarEvent(channelId, calendarEventId);
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, calendarEventId } });
		return await this.router.calenderEvents
			.update(channelId, calendarEventId, payload)
			.then((res) => {
				if (!raw) raw = new CalendarEvent(this, res);
				else raw.__update(res);
				channel.calenderEvents.add(raw.id, raw, true);
				return raw;
			});
	}

	async deleteRESTCalenderEvent(channelId: string, calendarEventId: string): Promise<boolean> {
		const channel = this.getChannel(channelId) ?? (await this.getRESTChannel(channelId));
		if (!channel)
			throw new GuildedAPIError('invalid_channel', { meta: { channelId, calendarEventId } });
		return await this.router.calenderEvents.delete(channelId, calendarEventId).then(() => {
			channel.calenderEvents.delete(calendarEventId);
			return true;
		});
	}

	getCalendarEventRsvps(
		channelId: string,
		calendarEventId: string,
	): Collection<string, CalendarEventRsvp> | undefined {
		const cEvent = this.getCalendarEvent(channelId, calendarEventId);
		if (!cEvent) return undefined;
		else return cEvent.rsvps;
	}

	getCalendarEventRsvp(
		channelId: string,
		calendarEventId: string,
		userId: string,
	): CalendarEventRsvp | undefined {
		const cEvent = this.getCalendarEvent(channelId, calendarEventId);
		if (!cEvent) return undefined;
		else return cEvent.rsvps.get(userId);
	}

	async getRESTCalendarEventRsvps(
		channelId: string,
		calendarEventId: string,
		cache = true,
	): Promise<Array<CalendarEventRsvp>> {
		const cEvent =
			this.getCalendarEvent(channelId, calendarEventId) ??
			(await this.getRESTCalendarEvent(channelId, calendarEventId));
		let raw: CalendarEventRsvp | undefined;
		if (!cEvent)
			throw new GuildedAPIError('invalid_calendar_event', {
				meta: { channelId, calendarEventId },
			});
		return await this.router.calendarEventRsvps
			.fetchAll(channelId, calendarEventId)
			.then((res) =>
				res.map((cErsvp) => {
					raw = this.getCalendarEventRsvp(channelId, calendarEventId, cErsvp.userId);
					if (!raw) raw = new CalendarEventRsvp(this, cErsvp);
					else raw.__update(cErsvp);
					if (cache) cEvent.rsvps.add(raw.id, raw, true);
					return raw;
				}),
			);
	}

	async getRESTCalendarEventRsvp(
		channelId: string,
		calendarEventId: string,
		userId: string,
		cache = true,
	): Promise<CalendarEventRsvp> {
		const cEvent =
			this.getCalendarEvent(channelId, calendarEventId) ??
			(await this.getRESTCalendarEvent(channelId, calendarEventId));
		let raw = this.getCalendarEventRsvp(channelId, calendarEventId, userId);
		if (!cEvent)
			throw new GuildedAPIError('invalid_calendar_event', {
				meta: { channelId, calendarEventId, userId },
			});
		return await this.router.calendarEventRsvps
			.fetch(channelId, calendarEventId, userId)
			.then((res) => {
				if (!raw) raw = new CalendarEventRsvp(this, res);
				else raw.__update(res);
				if (cache) cEvent.rsvps.add(raw.id, raw, true);
				return raw;
			});
	}

	async createRESTCalendarEventRsvp(
		channelId: string,
		calendarEventId: string,
		userId: string,
		payload: restCalendarEventRsvpPayload,
	): Promise<CalendarEventRsvp> {
		const cEvent =
			this.getCalendarEvent(channelId, calendarEventId) ??
			(await this.getRESTCalendarEvent(channelId, calendarEventId));
		if (!cEvent)
			throw new GuildedAPIError('invalid_calendar_event', {
				meta: { channelId, calendarEventId, userId },
			});
		return await this.router.calendarEventRsvps
			.update(channelId, calendarEventId, userId, payload)
			.then((res) => new CalendarEventRsvp(this, res))
			.then((cERsvp) => {
				cEvent.rsvps.add(cERsvp.id, cERsvp, true);
				return cERsvp;
			});
	}

	async editRESTCalendarEventRsvp(
		channelId: string,
		calendarEventId: string,
		userId: string,
		payload: restCalendarEventRsvpPayload,
	): Promise<CalendarEventRsvp> {
		const cEvent =
			this.getCalendarEvent(channelId, calendarEventId) ??
			(await this.getRESTCalendarEvent(channelId, calendarEventId));
		let raw = this.getCalendarEventRsvp(channelId, calendarEventId, userId);
		if (!cEvent)
			throw new GuildedAPIError('invalid_calendar_event', {
				meta: { channelId, calendarEventId, userId },
			});
		return await this.router.calendarEventRsvps
			.update(channelId, calendarEventId, userId, payload)
			.then((res) => {
				if (!raw) raw = new CalendarEventRsvp(this, res);
				else raw.__update(res);
				cEvent.rsvps.add(raw.id, raw, true);
				return raw;
			});
	}

	async deleteRESTCalendarEventRsvp(
		channelId: string,
		calendarEventId: string,
		userId: string,
	): Promise<boolean> {
		const cEvent =
			this.getCalendarEvent(channelId, calendarEventId) ??
			(await this.getRESTCalendarEvent(channelId, calendarEventId));
		if (!cEvent)
			throw new GuildedAPIError('invalid_calendar_event', {
				meta: { channelId, calendarEventId, userId },
			});
		return await this.router.calendarEventRsvps
			.delete(channelId, calendarEventId, userId)
			.then(() => {
				cEvent.rsvps.delete(userId);
				return true;
			});
	}

	async addRESTReactionToMessage(
		channelId: string,
		messageId: string,
		emoteId: string,
		cache = true,
	): Promise<BaseReaction> {
		const message =
			this.getChatMessage(channelId, messageId) ??
			(await this.getRESTChatMessage(channelId, messageId));
		if (!message)
			throw new GuildedAPIError('invalid_chat_message', {
				meta: { channelId, messageId, emoteId },
			});
		return await this.router.reactions
			.addOnContent(channelId, messageId, emoteId)
			.then(() => ({
				reactedBy: this.user?.id as string,
				emoteId: emoteId,
			}))
			.then((reaction: BaseReaction) => {
				if (cache) message.reactions.push(reaction);
				return reaction;
			});
	}

	async deleteRESTReactionFromMessage(
		channelId: string,
		messageId: string,
		emoteId: string,
	): Promise<boolean> {
		const message =
			this.getChatMessage(channelId, messageId) ??
			(await this.getRESTChatMessage(channelId, messageId));
		if (!message)
			throw new GuildedAPIError('invalid_chat_message', {
				meta: { channelId, messageId, emoteId },
			});
		return await this.router.reactions
			.deleteFromContent(channelId, messageId, emoteId)
			.then(() => {
				message.reactions = message.reactions.filter(
					(reaction) => reaction.emoteId.trim() !== emoteId.trim(),
				);
				return true;
			});
	}

	async addRESTReactionToForumTopic(
		channelId: string,
		forumTopicId: string,
		emoteId: string,
		cache = true,
	): Promise<BaseReaction> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', {
				meta: { channelId, forumTopicId, emoteId },
			});
		return await this.router.reactions
			.addOnForumTopic(channelId, forumTopicId, emoteId)
			.then(() => ({
				reactedBy: this.user?.id as string,
				emoteId: emoteId,
			}))
			.then((reaction: BaseReaction) => {
				if (cache) forumTopic.reactions.push(reaction);
				return reaction;
			});
	}

	async deleteRESTReactionFromForumTopic(
		channelId: string,
		forumTopicId: string,
		emoteId: string,
	): Promise<boolean> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		if (!forumTopic)
			throw new GuildedAPIError('invalid_forum_topic', {
				meta: { channelId, forumTopicId, emoteId },
			});
		return await this.router.reactions
			.deleteFromForumTopic(channelId, forumTopicId, emoteId)
			.then(() => {
				forumTopic.reactions = forumTopic.reactions.filter(
					(reaction) => reaction.emoteId.trim() !== emoteId.trim(),
				);
				return true;
			});
	}

	async addRESTReactionToForumTopicComment(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
		emoteId: string,
		cache = true,
	): Promise<BaseReaction> {
		const forumTopicComment =
			this.getForumTopicComment(channelId, forumTopicId, forumTopicCommentId) ??
			(await this.getRESTForumTopicComment(channelId, forumTopicId, forumTopicCommentId));
		if (!forumTopicComment)
			throw new GuildedAPIError('invalid_forum_topic_comment', {
				meta: { channelId, forumTopicId, forumTopicCommentId, emoteId },
			});
		return await this.router.reactions
			.addOnForumTopicComment(channelId, forumTopicId, forumTopicCommentId, emoteId)
			.then(() => ({
				reactedBy: this.user?.id as string,
				emoteId: emoteId,
			}))
			.then((reaction: BaseReaction) => {
				if (cache) forumTopicComment.reactions.push(reaction);
				return reaction;
			});
	}

	async deleteRESTReactionFromForumTopicComment(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
		emoteId: string,
	): Promise<BaseReaction> {
		const forumTopicComment =
			this.getForumTopicComment(channelId, forumTopicId, forumTopicCommentId) ??
			(await this.getRESTForumTopicComment(channelId, forumTopicId, forumTopicCommentId));
		if (!forumTopicComment)
			throw new GuildedAPIError('invalid_forum_topic_comment', {
				meta: { channelId, forumTopicId, forumTopicCommentId, emoteId },
			});
		return await this.router.reactions
			.deleteFromForumTopicComment(channelId, forumTopicId, forumTopicCommentId, emoteId)
			.then(() => ({
				reactedBy: this.user?.id as string,
				emoteId: emoteId,
			}))
			.then((reaction: BaseReaction) => {
				forumTopicComment.reactions = forumTopicComment.reactions.filter(
					(reaction) => reaction.emoteId.trim() !== emoteId.trim(),
				);
				return reaction;
			});
	}

	async awardXPRESTToServerMember(
		serverId: string,
		userId: string,
		amount: number,
	): Promise<Member> {
		const member =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		if (!member)
			throw new GuildedAPIError('invalid_server_member', {
				meta: { serverId, userId, amount },
			});
		return await this.router.serverXps
			.awardToMember(serverId, userId, { amount: amount })
			.then((res) => {
				member.__update({ xp: res.total });
				return member;
			});
	}

	async awardXPRESTToServerRole(
		serverId: string,
		roleId: string,
		amount: number,
	): Promise<Boolean> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		if (!server)
			throw new GuildedAPIError('invalid_server', {
				meta: { serverId, roleId, amount },
			});
		return await this.router.serverXps.awardToRole(serverId, roleId, { amount: amount });
	}

	async editXPRESTToServerMember(
		serverId: string,
		userId: string,
		amount: number,
	): Promise<Member> {
		const member =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		if (!member)
			throw new GuildedAPIError('invalid_server_member', {
				meta: { serverId, userId, amount },
			});
		return await this.router.serverXps
			.updateToMember(serverId, userId, { total: amount })
			.then((res) => {
				member.__update({ xp: res.total });
				return member;
			});
	}

	async getRESTServerMemberSocialLinks(
		serverId: string,
		userId: string,
		type: string,
		cache = true,
	): Promise<ApiBaseSocialLinks> {
		const member =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		if (!member)
			throw new GuildedAPIError('invalid_server_member', {
				meta: { serverId, userId, type },
			});
		return await this.router.members.fetchSocialLinks(serverId, userId, type).then((res) => {
			if (cache) member.socialLinks.push(res);
			return res;
		});
	}

	async addRESTMemberToGroup(groupId: string, userId: string): Promise<Boolean> {
		return this.router.groupMemberships.add(groupId, userId);
	}

	async removeRESTMemberToGroup(groupId: string, userId: string): Promise<Boolean> {
		return this.router.groupMemberships.remove(groupId, userId);
	}

	getMemberRoles(serverId: string, userId: string): Array<string> | undefined {
		const member = this.getServerMember(serverId, userId);
		if (!member) return undefined;
		else return member.roleIds;
	}

	async getRESTMemberRoles(
		serverId: string,
		userId: string,
		cache = true,
	): Promise<Array<string>> {
		const member =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		if (!member)
			throw new GuildedAPIError('invalid_server_member', {
				meta: { serverId, userId },
			});
		return await this.router.roleMemberships.fetch(serverId, userId).then((res) => {
			if (cache) member.__update({ roleIds: res });
			return res.map((role) => role?.toString());
		});
	}

	async addRESTRoleToMember(serverId: string, userId: string, roleId: string): Promise<Member> {
		const member =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		if (!member)
			throw new GuildedAPIError('invalid_server_member', {
				meta: { serverId, userId },
			});
		return await this.router.roleMemberships.add(serverId, userId, roleId).then(() => {
			member.roleIds?.push(roleId);
			return member;
		});
	}

	async removeRESTRoleFromMember(
		serverId: string,
		userId: string,
		roleId: string,
	): Promise<Member> {
		const member =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		if (!member)
			throw new GuildedAPIError('invalid_server_member', {
				meta: { serverId, userId },
			});
		return await this.router.roleMemberships.remove(serverId, userId, roleId).then(() => {
			member.roleIds = member.roleIds?.filter((id) => id.trim() !== roleId.trim());
			return member;
		});
	}

	getServerWebhooks(serverId: string): Collection<string, Webhook> | undefined {
		const server = this.getServer(serverId);
		if (!server) return undefined;
		else return server.webhooks;
	}

	getChannelWebhooks(channelId: string): Collection<string, Webhook> | undefined {
		const channel = this.getChannel(channelId);
		if (!channel) return undefined;
		else return channel.webhooks;
	}

	getWebhook(serverId: string, webhookId: string): Webhook | undefined {
		const server = this.getServer(serverId);
		if (!server) return undefined;
		else return server.webhooks.get(webhookId);
	}

	async getRESTWebhooks(
		serverId: string,
		channelId?: string,
		cache = true,
	): Promise<Array<Webhook>> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		let raw: Webhook | undefined;
		if (!server)
			throw new GuildedAPIError('invalid_server', {
				meta: { serverId },
			});
		return await this.router.webhooks
			.fetchAll(serverId, channelId ? { channelId: channelId } : undefined)
			.then((res) =>
				res.map((wH) => {
					raw = this.getWebhook(serverId, wH.id);
					if (!raw) raw = new Webhook(this, wH);
					else raw.__update(wH);
					if (cache) server.webhooks.add(raw.id, raw, true);
					return raw;
				}),
			);
	}

	async getRESTWebhook(serverId: string, webhoookId: string, cache = true): Promise<Webhook> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		let raw = this.getWebhook(serverId, webhoookId);
		if (!server)
			throw new GuildedAPIError('invalid_server', {
				meta: { serverId },
			});
		return await this.router.webhooks.fetch(serverId, webhoookId).then((res) => {
			if (!raw) raw = new Webhook(this, res);
			else raw.__update(res);
			if (cache) server.webhooks.add(raw.id, raw, true);
			return raw;
		});
	}

	async createRESTWebhook(serverId: string, channelId: string, name: string): Promise<Webhook> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		if (!server)
			throw new GuildedAPIError('invalid_server', {
				meta: { serverId },
			});
		return await this.router.webhooks
			.create(serverId, { channelId, name })
			.then((res) => new Webhook(this, res))
			.then((webhook) => {
				server.webhooks.add(webhook.id, webhook, true);
				return webhook;
			});
	}

	async editRESTWebhook(
		serverId: string,
		webhookId: string,
		payload: restWebhookUpdatePayload,
	): Promise<Webhook> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		let raw = this.getWebhook(serverId, webhookId);
		if (!server)
			throw new GuildedAPIError('invalid_server', {
				meta: { serverId },
			});
		return await this.router.webhooks.update(serverId, webhookId, payload).then((res) => {
			if (!raw) raw = new Webhook(this, res);
			else raw.__update(res);
			server.webhooks.add(raw.id, raw, true);
			return raw;
		});
	}

	async deleteRESTWebhook(serverId: string, webhookId: string): Promise<Boolean> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		if (!server)
			throw new GuildedAPIError('invalid_server', {
				meta: { serverId },
			});
		return await this.router.webhooks.delete(serverId, webhookId);
	}
}

export interface ClientOption {
	rest?: restOptions;
	ws?: wsOptions;
	caches?: {
		messages: false;
	};
}
