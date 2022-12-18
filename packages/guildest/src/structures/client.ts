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
import TypedEmitter from 'typed-emitter';
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
import { eventsHandler } from '../handlers/events';
import {
	CalendarEventChannel,
	Channel,
	ChatSupportedChannel,
	DocChannel,
	ForumChannel,
	ListChannel,
	WebhookSupportedChannel,
} from './channels';
import { Server, Member, MemberBan } from './servers';
import { Message } from './messages';
import { ForumTopic, ForumTopicComment } from './forums';
import { ListItem } from './listItems';
import { Doc } from './docs';
import { CalendarEvent, CalendarEventRsvp } from './calendarEvents';
import { BaseReaction } from './base';
import { Webhook } from './webhooks';
import { ClientEvents } from '../constants/typings';
import { fetchChannelType } from '../utils/basicUtils';

export class Client extends (EventEmitter as unknown as new () => TypedEmitter<ClientEvents>) {
	user?: ClientUser;
	readyTimestamp?: number;

	ws: webSocketManager = new webSocketManager({ token: this.token, ...this.option.ws });
	rest: restManager = new restManager({ token: this.token, ...this.option.rest });

	__eventsHandler: eventsHandler = new eventsHandler(this);
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
		calendarEvents: new CalendarEventRouter(this.rest),
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
		this.ws.on('ready', (user) => {
			this.user = new ClientUser(this, user);
			this.readyTimestamp = Date.now();
			this.emit('ready');
		});

		this.ws.on('events', (eNm, eVp) => this.__eventsHandler.events[eNm](eVp));
	}

	getChannel<R = Channel>(channelId: string): R | undefined {
		let channel = this.__collections.get(channelId);
		if (channel && channel instanceof Channel) return channel as R;
		else return undefined;
	}

	async getRESTChannel<R = Channel>(channelId: string, cache = true): Promise<R> {
		const raw = this.getChannel<Channel>(channelId);
		return await this.router.channels
			.fetch(channelId)
			.then((res) => {
				if (!raw) return new (fetchChannelType(res.type))(this, res);
				else raw._update(res);
				return raw;
			})
			.then((cH) => {
				if (cache) this.__collections.add(channelId, cH, true);
				return cH as R;
			});
	}

	async createRESTChannel(payload: restCreateChannelPayload): Promise<Channel> {
		return await this.router.channels.create(payload).then((res) => {
			let exChannel = this.getChannel(res.id);
			if (!exChannel) exChannel = new (fetchChannelType(res.type))(this, res);
			else exChannel._update(res);
			this.__collections.add(exChannel.id, exChannel);
			return exChannel;
		});
	}

	async editRESTChannel(channelId: string, payload: restUpdateChannelPayload): Promise<Channel> {
		const raw = this.getChannel(channelId);
		return await this.router.channels
			.update(channelId, payload)
			.then((res) => {
				if (!raw) return new (fetchChannelType(res.type))(this, res);
				else raw._update(res);
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
				else raw._update(res);
				return raw;
			})
			.then((sR) => {
				if (cache) this.__collections.add(serverId, sR, true);
				return sR;
			});
	}

	getChatMessages(channelId: string): Collection<string, Message> | undefined {
		const channel = this.getChannel<ChatSupportedChannel>(channelId);
		if (!channel) return undefined;
		else return channel.messages;
	}

	getChatMessage(channelId: string, messageId: string): Message | undefined {
		const messages = this.getChatMessages(channelId);
		if (!messages) return undefined;
		else return messages.get(messageId);
	}

	async getRESTChatMessages(channelId: string, cache = true): Promise<Array<Message>> {
		const channel =
			this.getChannel<ChatSupportedChannel>(channelId) ??
			(await this.getRESTChannel<ChatSupportedChannel>(channelId));
		let raw: Message | undefined;
		return await this.router.messages.fetchAll(channelId).then((res) =>
			res.map((msg) => {
				raw = this.getChatMessage(channelId, msg.id);
				if (!raw) raw = new Message(this, msg);
				else raw._update(msg);
				if (cache) channel.messages.add(raw.id, raw, true);
				return raw;
			}),
		);
	}

	async getRESTChatMessage(channelId: string, messageId: string, cache = true): Promise<Message> {
		const channel =
			this.getChannel<ChatSupportedChannel>(channelId) ??
			(await this.getRESTChannel<ChatSupportedChannel>(channelId));
		let exMessage = this.getChatMessage(channelId, messageId);
		return await this.router.messages.fetch(channelId, messageId).then((res) => {
			if (!exMessage) exMessage = new Message(this, res);
			else exMessage._update(res);
			if (cache) channel.messages.add(exMessage.id, exMessage, true);
			return exMessage;
		});
	}

	async createRESTChatMessage(
		channelId: string,
		payload: restChannelMessageCreatePayload,
	): Promise<Message> {
		const channel =
			this.getChannel<ChatSupportedChannel>(channelId) ??
			(await this.getRESTChannel<ChatSupportedChannel>(channelId));
		return await this.router.messages.create(channelId, payload).then((res) => {
			let exMessage = this.getChatMessage(channelId, res.id);
			if (!exMessage) exMessage = new Message(this, res);
			else exMessage._update(res);
			channel.messages.add(exMessage.id, exMessage, true);
			return exMessage;
		});
	}

	async editRESTChatMessage(
		channelId: string,
		messageId: string,
		payload: restChannelMessageEditPayload,
	): Promise<Message> {
		const channel =
			this.getChannel<ChatSupportedChannel>(channelId) ??
			(await this.getRESTChannel<ChatSupportedChannel>(channelId));
		let message = this.getChatMessage(channelId, messageId);
		return await this.router.messages
			.update(channelId, messageId, payload)
			.then((res) => {
				if (!message) message = new Message(this, res);
				else message._update(res);
				return message;
			})
			.then((msg) => {
				channel.messages.add(messageId, msg, true);
				return msg;
			});
	}

	async deleteRESTChatMessage(channelId: string, messageId: string): Promise<boolean> {
		const channel =
			this.getChannel<ChatSupportedChannel>(channelId) ??
			(await this.getRESTChannel<ChatSupportedChannel>(channelId));
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
		const members = this.getServerMembers(serverId);
		if (!members) return undefined;
		else return members.get(userId);
	}

	async getRESTServerMembers(serverId: string, cache = true): Promise<Array<Member>> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		return await this.router.members.fetchAll(serverId).then((res) =>
			res.map((mem) => {
				let member = this.getServerMember(serverId, mem.user.id);
				if (!member) member = new Member(this, { ...mem, serverId: serverId });
				else member._update(mem);
				if (cache) server.members.add(member.id, member, true);
				return member;
			}),
		);
	}

	async getRESTServerMember(serverId: string, userId: string, cache = true): Promise<Member> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		let exMember = this.getServerMember(serverId, userId);
		return await this.router.members.fetch(serverId, userId).then((res) => {
			if (!exMember) exMember = new Member(this, { ...res, serverId: serverId });
			else exMember._update(res);
			if (cache) server.members.add(exMember.id, exMember, true);
			return exMember;
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
		return await this.router.members
			.update(serverId, userId, { nickname: nickname })
			.then(() => {
				member._update({ nickname: nickname });
				return member;
			});
	}

	async deleteRESTServerMemberNickname(serverId: string, userId: string): Promise<Member> {
		const member =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		return await this.router.members.delete(serverId, userId).then(() => {
			member._update({ nickname: undefined });
			return member;
		});
	}

	async kickRESTServerMember(serverId: string, userId: string): Promise<boolean> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
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
		const memberBans = this.getServerMemberBans(serverId);
		if (!memberBans) return undefined;
		else return memberBans.get(userId);
	}

	async getRESTServerMemberBans(serverId: string, cache = true): Promise<Array<MemberBan>> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		return await this.router.bans.fetchAll(serverId).then((res) =>
			res.map((ban) => {
				let exMemberBan = this.getServerMemberBan(serverId, ban.user.id);
				if (!exMemberBan) exMemberBan = new MemberBan(this, ban);
				else exMemberBan._update(ban);
				if (cache) server.bans.add(exMemberBan.id, exMemberBan);
				return exMemberBan;
			}),
		);
	}

	async getRESTServerMemberBan(
		serverId: string,
		userId: string,
		cache = true,
	): Promise<MemberBan> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		let exMemberBan = this.getServerMemberBan(serverId, userId);
		return await this.router.bans.fetch(serverId, userId).then((res) => {
			if (!exMemberBan) exMemberBan = new MemberBan(this, res);
			else exMemberBan._update(res);
			if (cache && server) server.bans.add(exMemberBan.id, exMemberBan);
			return exMemberBan;
		});
	}

	async createRESTServerMemberBan(
		serverId: string,
		userId: string,
		reason?: string,
	): Promise<MemberBan> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		return await this.router.bans.create(serverId, userId, { reason: reason }).then((res) => {
			let exMemberBan = this.getServerMemberBan(serverId, userId);
			if (!exMemberBan) exMemberBan = new MemberBan(this, res);
			else exMemberBan._update(res);
			server.bans.add(exMemberBan.id, exMemberBan);
			return exMemberBan;
		});
	}

	async deleteRESTServerMemberBans(serverId: string, userId: string): Promise<boolean> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		return await this.router.bans.delete(serverId, userId).then(() => {
			server.bans.delete(userId);
			return true;
		});
	}

	getForumTopics(channelId: string): Collection<string, ForumTopic> | undefined {
		const channel = this.getChannel<ForumChannel>(channelId);
		if (!channel) return undefined;
		else return channel.forumTopics;
	}

	getForumTopic(channelId: string, forumTopicId: string): ForumTopic | undefined {
		const forumTopics = this.getForumTopics(channelId);
		if (!forumTopics) return undefined;
		else return forumTopics.get(forumTopicId);
	}

	async getRESTForumTopics(
		channelId: string,
		query: restForumTopicsQueryParams,
		cache = true,
	): Promise<Array<ForumTopic>> {
		const channel =
			this.getChannel<ForumChannel>(channelId) ??
			(await this.getRESTChannel<ForumChannel>(channelId));
		return await this.router.forumTopics.fetchAll(channelId, query).then((res) =>
			res.map((fT) => {
				let exForumTopic = this.getForumTopic(channelId, fT.id.toString());
				if (!exForumTopic) exForumTopic = new ForumTopic(this, fT);
				else exForumTopic._update(fT);
				if (cache) channel.forumTopics.add(exForumTopic.id, exForumTopic);
				return exForumTopic;
			}),
		);
	}

	async getRESTForumTopic(
		channelId: string,
		forumTopicId: string,
		cache = true,
	): Promise<ForumTopic> {
		const channel =
			this.getChannel<ForumChannel>(channelId) ??
			(await this.getRESTChannel<ForumChannel>(channelId));
		let exForumTopic = this.getForumTopic(channelId, forumTopicId);
		return await this.router.forumTopics.fetch(channelId, forumTopicId).then((res) => {
			if (!exForumTopic) exForumTopic = new ForumTopic(this, res);
			else exForumTopic._update(res);
			if (cache) channel.forumTopics.add(exForumTopic.id, exForumTopic, true);
			return exForumTopic;
		});
	}

	async createRESTForumTopic(
		channelId: string,
		payload: restForumTopicCreatePayload,
		cache = true,
	): Promise<ForumTopic> {
		const channel =
			this.getChannel<ForumChannel>(channelId) ??
			(await this.getRESTChannel<ForumChannel>(channelId));
		return await this.router.forumTopics.create(channelId, payload).then((res) => {
			let exForumTopic = this.getForumTopic(channelId, res.id.toString());
			if (!exForumTopic) exForumTopic = new ForumTopic(this, res);
			else exForumTopic._update(res);
			if (cache) channel.forumTopics.add(exForumTopic.id, exForumTopic, true);
			return exForumTopic;
		});
	}

	async editRESTForumTopic(
		channelId: string,
		forumTopicId: string,
		payload: restForumTopicUpdatePayload,
	): Promise<ForumTopic> {
		const channel =
			this.getChannel<ForumChannel>(channelId) ??
			(await this.getRESTChannel<ForumChannel>(channelId));
		let exForumTopic = this.getForumTopic(channelId, forumTopicId);
		return await this.router.forumTopics
			.update(channelId, forumTopicId, payload)
			.then((res) => {
				if (!exForumTopic) exForumTopic = new ForumTopic(this, res);
				else exForumTopic._update(res);
				channel.forumTopics.add(exForumTopic.id, exForumTopic, true);
				return exForumTopic;
			});
	}

	async deleteRESTForumTopic(channelId: string, forumTopicId: string): Promise<boolean> {
		const channel =
			this.getChannel<ForumChannel>(channelId) ??
			(await this.getRESTChannel<ForumChannel>(channelId));
		return await this.router.forumTopics.delete(channelId, forumTopicId).then(() => {
			channel.forumTopics.delete(forumTopicId);
			return true;
		});
	}

	async pinRESTForumTopic(channelId: string, forumTopicId: string): Promise<ForumTopic> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		return await this.router.forumTopics.pin(channelId, forumTopicId).then(() => {
			forumTopic._update({ isPinned: true });
			return forumTopic;
		});
	}

	async unpinRESTForumTopic(channelId: string, forumTopicId: string): Promise<ForumTopic> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		return await this.router.forumTopics.unpin(channelId, forumTopicId).then(() => {
			forumTopic._update({ isPinned: false });
			return forumTopic;
		});
	}

	async lockRESTForumTopic(channelId: string, forumTopicId: string): Promise<ForumTopic> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		return await this.router.forumTopics.lock(channelId, forumTopicId).then(() => {
			forumTopic._update({ isLocked: true });
			return forumTopic;
		});
	}

	async unlockRESTForumTopic(channelId: string, forumTopicId: string): Promise<ForumTopic> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		return await this.router.forumTopics.unlock(channelId, forumTopicId).then(() => {
			forumTopic._update({ isLocked: false });
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
		const forumTopicComments = this.getForumTopicComments(channelId, forumTopicId);
		if (!forumTopicComments) return undefined;
		else return forumTopicComments.get(forumTopicCommentId);
	}

	async getRESTForumTopicComments(
		channelId: string,
		forumTopicId: string,
		cache = true,
	): Promise<Array<ForumTopicComment>> {
		const forumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		return await this.router.forumTopicComments.fetchAll(channelId, forumTopicId).then((res) =>
			res.map((fTc) => {
				let exForumTopicComment = this.getForumTopicComment(
					channelId,
					forumTopicId,
					fTc.id.toString(),
				);
				if (!exForumTopicComment) exForumTopicComment = new ForumTopicComment(this, fTc);
				else exForumTopicComment._update(fTc);
				if (cache)
					forumTopic.comments.add(exForumTopicComment.id, exForumTopicComment, true);
				return exForumTopicComment;
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
		let exForumTopicComment = this.getForumTopicComment(
			channelId,
			forumTopicId,
			forumTopicCommentId,
		);
		return await this.router.forumTopicComments
			.fetch(channelId, forumTopicId, forumTopicCommentId)
			.then((res) => {
				if (!exForumTopicComment) exForumTopicComment = new ForumTopicComment(this, res);
				else exForumTopicComment._update(res);
				if (cache)
					forumTopic.comments.add(exForumTopicComment.id, exForumTopicComment, true);
				return exForumTopicComment;
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
		return await this.router.forumTopicComments
			.create(channelId, forumTopicId, { content: content })
			.then((res) => {
				let exForumTopicComment = this.getForumTopicComment(
					channelId,
					forumTopicId,
					res.id.toString(),
				);
				if (!exForumTopicComment) exForumTopicComment = new ForumTopicComment(this, res);
				else exForumTopicComment._update(res);
				forumTopic.comments.add(exForumTopicComment.id, exForumTopicComment, true);
				return exForumTopicComment;
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
		let exForumTopicComment = this.getForumTopicComment(
			channelId,
			forumTopicId,
			forumTopicCommentId,
		);
		return await this.router.forumTopicComments
			.update(channelId, forumTopicId, forumTopicCommentId, { content: content })
			.then((res) => {
				if (!exForumTopicComment) exForumTopicComment = new ForumTopicComment(this, res);
				else exForumTopicComment._update(res);
				forumTopic.comments.add(exForumTopicComment.id, exForumTopicComment, true);
				return exForumTopicComment;
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
		return await this.router.forumTopicComments
			.delete(channelId, forumTopicId, forumTopicCommentId)
			.then(() => {
				forumTopic.comments.delete(forumTopicCommentId);
				return true;
			});
	}

	getListItems(channelId: string): Collection<string, ListItem> | undefined {
		const channel = this.getChannel<ListChannel>(channelId);
		if (!channel) return undefined;
		else return channel.items;
	}

	getListItem(channelId: string, listItemId: string): ListItem | undefined {
		const items = this.getListItems(channelId);
		if (!items) return undefined;
		else return items.get(listItemId);
	}

	async getRESTListItems(channelId: string, cache = true): Promise<Array<ListItem>> {
		const channel =
			this.getChannel<ListChannel>(channelId) ??
			(await this.getRESTChannel<ListChannel>(channelId));
		return await this.router.listItems.fetchAll(channelId).then((res) =>
			res.map((liT) => {
				let exListItem = this.getListItem(channelId, liT.id);
				if (!exListItem) exListItem = new ListItem(this, liT);
				else exListItem._update(liT);
				if (cache) channel.items.add(exListItem.id, exListItem, true);
				return exListItem;
			}),
		);
	}

	async getRESTListItem(channelId: string, listItemId: string, cache = true): Promise<ListItem> {
		const channel =
			this.getChannel<ListChannel>(channelId) ??
			(await this.getRESTChannel<ListChannel>(channelId));
		let exListItem = this.getListItem(channelId, listItemId);
		return await this.router.listItems.fetch(channelId, listItemId).then((res) => {
			if (!exListItem) exListItem = new ListItem(this, res);
			else exListItem._update(res);
			if (cache) channel.items.add(exListItem.id, exListItem, true);
			return exListItem;
		});
	}

	async createRESTListItem(
		channelId: string,
		message: string,
		note?: { content: string },
	): Promise<ListItem> {
		const channel =
			this.getChannel<ListChannel>(channelId) ??
			(await this.getRESTChannel<ListChannel>(channelId));
		return await this.router.listItems
			.create(channelId, { message: message, note: note })
			.then((res) => {
				let exListItem = this.getListItem(channelId, res.id);
				if (!exListItem) exListItem = new ListItem(this, res);
				else exListItem._update(res);
				channel.items.add(exListItem.id, exListItem, true);
				return exListItem;
			});
	}

	async editRESTListItem(
		channelId: string,
		listItemId: string,
		message: string,
		note?: { content: string },
	): Promise<ListItem> {
		const channel =
			this.getChannel<ListChannel>(channelId) ??
			(await this.getRESTChannel<ListChannel>(channelId));
		let exListItem = this.getListItem(channelId, listItemId);
		return await this.router.listItems
			.update(channelId, listItemId, { message: message, note: note })
			.then((res) => {
				if (!exListItem) exListItem = new ListItem(this, res);
				else exListItem._update(res);
				channel.items.add(exListItem.id, exListItem, true);
				return exListItem;
			});
	}

	async deleteRESTListItem(channelId: string, listItemId: string): Promise<boolean> {
		const channel =
			this.getChannel<ListChannel>(channelId) ??
			(await this.getRESTChannel<ListChannel>(channelId));
		return await this.router.listItems.delete(channelId, listItemId).then(() => {
			channel.items.delete(listItemId);
			return true;
		});
	}

	async completeRESTListItem(channelId: string, listItemId: string): Promise<ListItem> {
		const exListItem =
			this.getListItem(channelId, listItemId) ??
			(await this.getRESTListItem(channelId, listItemId));
		return await this.router.listItems.complete(channelId, listItemId).then(() => {
			exListItem._update({
				completedAt: new Date().toISOString(),
				completedBy: this.user?.id,
			});
			return exListItem;
		});
	}

	async uncompleteRESTListItem(channelId: string, listItemId: string): Promise<ListItem> {
		const exListItem =
			this.getListItem(channelId, listItemId) ??
			(await this.getRESTListItem(channelId, listItemId));
		return await this.router.listItems.uncomplete(channelId, listItemId).then(() => {
			exListItem._update({ completedAt: undefined, completedBy: undefined });
			return exListItem;
		});
	}

	getDocs(channelId: string): Collection<string, Doc> | undefined {
		const channel = this.getChannel<DocChannel>(channelId);
		if (!channel) return undefined;
		else return channel.docs;
	}

	getDoc(channelId: string, docId: string): Doc | undefined {
		const docs = this.getDocs(channelId);
		if (!docs) return undefined;
		else return docs.get(docId);
	}

	async getRESTDocs(
		channelId: string,
		query?: restDocsQueryParams,
		cache = true,
	): Promise<Array<Doc>> {
		const channel =
			this.getChannel<DocChannel>(channelId) ??
			(await this.getRESTChannel<DocChannel>(channelId));
		return await this.router.docs.fetchAll(channelId, query).then((res) =>
			res.map((doc) => {
				let exDoc = this.getDoc(channelId, doc.id.toString());
				if (!exDoc) exDoc = new Doc(this, doc);
				else exDoc._update(doc);
				if (cache) channel.docs.add(exDoc.id, exDoc, true);
				return exDoc;
			}),
		);
	}

	async getRESTDoc(channelId: string, docId: string, cache = true): Promise<Doc> {
		const channel =
			this.getChannel<DocChannel>(channelId) ??
			(await this.getRESTChannel<DocChannel>(channelId));
		let exDoc = this.getDoc(channelId, docId);
		return await this.router.docs.fetch(channelId, docId).then((res) => {
			if (!exDoc) exDoc = new Doc(this, res);
			else exDoc._update(res);
			if (cache) channel.docs.add(exDoc.id, exDoc, true);
			return exDoc;
		});
	}

	async createRESTDoc(channelId: string, title: string, content: string): Promise<Doc> {
		const channel =
			this.getChannel<DocChannel>(channelId) ??
			(await this.getRESTChannel<DocChannel>(channelId));
		return await this.router.docs.create(channelId, { title, content }).then((res) => {
			let exDoc = this.getDoc(channelId, res.id.toString());
			if (!exDoc) exDoc = new Doc(this, res);
			else exDoc._update(res);
			channel.docs.add(exDoc.id, exDoc, true);
			return exDoc;
		});
	}

	async editRESTDoc(
		channelId: string,
		docId: string,
		title: string,
		content: string,
	): Promise<Doc> {
		const channel =
			this.getChannel<DocChannel>(channelId) ??
			(await this.getRESTChannel<DocChannel>(channelId));
		let exDoc = this.getDoc(channelId, docId);
		return await this.router.docs.update(channelId, docId, { title, content }).then((res) => {
			if (!exDoc) exDoc = new Doc(this, res);
			else exDoc._update(res);
			channel.docs.add(exDoc.id, exDoc, true);
			return exDoc;
		});
	}

	async deleteRESTDoc(channelId: string, docId: string): Promise<boolean> {
		const channel =
			this.getChannel<DocChannel>(channelId) ??
			(await this.getRESTChannel<DocChannel>(channelId));
		return await this.router.docs.delete(channelId, docId).then(() => {
			channel.docs.delete(docId);
			return true;
		});
	}

	getCalendarEvents(channelId: string): Collection<string, CalendarEvent> | undefined {
		const channel = this.getChannel<CalendarEventChannel>(channelId);
		if (!channel) return undefined;
		else return channel.calendarEvents;
	}

	getCalendarEvent(channelId: string, calendarEventId: string): CalendarEvent | undefined {
		const events = this.getCalendarEvents(channelId);
		if (!events) return undefined;
		else return events.get(calendarEventId);
	}

	async getRESTCalendarEvents(
		channelId: string,
		query?: restCalendarEventPayload,
		cache = true,
	): Promise<Array<CalendarEvent>> {
		const channel =
			this.getChannel<CalendarEventChannel>(channelId) ??
			(await this.getRESTChannel<CalendarEventChannel>(channelId));
		return await this.router.calendarEvents.fetchAll(channelId, query).then((res) =>
			res.map((cE) => {
				let exCalEvents = this.getCalendarEvent(channelId, cE.id.toString());
				if (!exCalEvents) exCalEvents = new CalendarEvent(this, cE);
				else exCalEvents._update(cE);
				if (cache) channel.calendarEvents.add(exCalEvents.id, exCalEvents, true);
				return exCalEvents;
			}),
		);
	}

	async getRESTCalendarEvent(
		channelId: string,
		calendarEventId: string,
		cache = true,
	): Promise<CalendarEvent> {
		const channel =
			this.getChannel<CalendarEventChannel>(channelId) ??
			(await this.getRESTChannel<CalendarEventChannel>(channelId));
		let exCalEvents = this.getCalendarEvent(channelId, calendarEventId);
		return await this.router.calendarEvents.fetch(channelId, calendarEventId).then((res) => {
			if (!exCalEvents) exCalEvents = new CalendarEvent(this, res);
			else exCalEvents._update(res);
			if (cache) channel.calendarEvents.add(exCalEvents.id, exCalEvents, true);
			return exCalEvents;
		});
	}

	async createRESTCalendarEvent(
		channelId: string,
		payload: restCalendarEventPayload,
	): Promise<CalendarEvent> {
		const channel =
			this.getChannel<CalendarEventChannel>(channelId) ??
			(await this.getRESTChannel<CalendarEventChannel>(channelId));
		return await this.router.calendarEvents.create(channelId, payload).then((res) => {
			let exCalEvents = this.getCalendarEvent(channelId, res.id.toString());
			if (!exCalEvents) exCalEvents = new CalendarEvent(this, res);
			else exCalEvents._update(res);
			channel.calendarEvents.add(exCalEvents.id, exCalEvents, true);
			return exCalEvents;
		});
	}

	async editRESTCalendarEvent(
		channelId: string,
		calendarEventId: string,
		payload: restCalendarEventPayload,
	): Promise<CalendarEvent> {
		const channel =
			this.getChannel<CalendarEventChannel>(channelId) ??
			(await this.getRESTChannel<CalendarEventChannel>(channelId));
		let exCalEvents = this.getCalendarEvent(channelId, calendarEventId);
		return await this.router.calendarEvents
			.update(channelId, calendarEventId, payload)
			.then((res) => {
				if (!exCalEvents) exCalEvents = new CalendarEvent(this, res);
				else exCalEvents._update(res);
				channel.calendarEvents.add(exCalEvents.id, exCalEvents, true);
				return exCalEvents;
			});
	}

	async deleteRESTcalendarEvent(channelId: string, calendarEventId: string): Promise<boolean> {
		const channel =
			this.getChannel<CalendarEventChannel>(channelId) ??
			(await this.getRESTChannel<CalendarEventChannel>(channelId));
		return await this.router.calendarEvents.delete(channelId, calendarEventId).then(() => {
			channel.calendarEvents.delete(calendarEventId);
			return true;
		});
	}

	getCalendarEventRsvps(
		channelId: string,
		calendarEventId: string,
	): Collection<string, CalendarEventRsvp> | undefined {
		const exCalEvent = this.getCalendarEvent(channelId, calendarEventId);
		if (!exCalEvent) return undefined;
		else return exCalEvent.rsvps;
	}

	getCalendarEventRsvp(
		channelId: string,
		calendarEventId: string,
		userId: string,
	): CalendarEventRsvp | undefined {
		const exCalEventRsvps = this.getCalendarEventRsvps(channelId, calendarEventId);
		if (!exCalEventRsvps) return undefined;
		else return exCalEventRsvps.get(userId);
	}

	async getRESTCalendarEventRsvps(
		channelId: string,
		calendarEventId: string,
		cache = true,
	): Promise<Array<CalendarEventRsvp>> {
		const exCalEvent =
			this.getCalendarEvent(channelId, calendarEventId) ??
			(await this.getRESTCalendarEvent(channelId, calendarEventId));
		return await this.router.calendarEventRsvps
			.fetchAll(channelId, calendarEventId)
			.then((res) =>
				res.map((cErsvp) => {
					let exCalEventRsvp = this.getCalendarEventRsvp(
						channelId,
						calendarEventId,
						cErsvp.userId,
					);
					if (!exCalEventRsvp) exCalEventRsvp = new CalendarEventRsvp(this, cErsvp);
					else exCalEventRsvp._update(cErsvp);
					if (cache) exCalEvent.rsvps.add(exCalEventRsvp.id, exCalEventRsvp, true);
					return exCalEventRsvp;
				}),
			);
	}

	async getRESTCalendarEventRsvp(
		channelId: string,
		calendarEventId: string,
		userId: string,
		cache = true,
	): Promise<CalendarEventRsvp> {
		const exCalEvent =
			this.getCalendarEvent(channelId, calendarEventId) ??
			(await this.getRESTCalendarEvent(channelId, calendarEventId));
		let exCalEventRsvp = this.getCalendarEventRsvp(channelId, calendarEventId, userId);
		return await this.router.calendarEventRsvps
			.fetch(channelId, calendarEventId, userId)
			.then((res) => {
				if (!exCalEventRsvp) exCalEventRsvp = new CalendarEventRsvp(this, res);
				else exCalEventRsvp._update(res);
				if (cache) exCalEvent.rsvps.add(exCalEventRsvp.id, exCalEventRsvp, true);
				return exCalEventRsvp;
			});
	}

	async createRESTCalendarEventRsvp(
		channelId: string,
		calendarEventId: string,
		userId: string,
		payload: restCalendarEventRsvpPayload,
	): Promise<CalendarEventRsvp> {
		const exCalEvent =
			this.getCalendarEvent(channelId, calendarEventId) ??
			(await this.getRESTCalendarEvent(channelId, calendarEventId));
		return await this.router.calendarEventRsvps
			.update(channelId, calendarEventId, userId, payload)
			.then((res) => {
				let exCalEventRsvp = this.getCalendarEventRsvp(channelId, calendarEventId, userId);
				if (!exCalEventRsvp) exCalEventRsvp = new CalendarEventRsvp(this, res);
				else exCalEventRsvp._update(res);
				exCalEvent.rsvps.add(exCalEventRsvp.id, exCalEventRsvp, true);
				return exCalEventRsvp;
			});
	}

	async editRESTCalendarEventRsvp(
		channelId: string,
		calendarEventId: string,
		userId: string,
		payload: restCalendarEventRsvpPayload,
	): Promise<CalendarEventRsvp> {
		const exCalEvent =
			this.getCalendarEvent(channelId, calendarEventId) ??
			(await this.getRESTCalendarEvent(channelId, calendarEventId));
		let exCalEventRsvp = this.getCalendarEventRsvp(channelId, calendarEventId, userId);
		return await this.router.calendarEventRsvps
			.update(channelId, calendarEventId, userId, payload)
			.then((res) => {
				if (!exCalEventRsvp) exCalEventRsvp = new CalendarEventRsvp(this, res);
				else exCalEventRsvp._update(res);
				exCalEvent.rsvps.add(exCalEventRsvp.id, exCalEventRsvp, true);
				return exCalEventRsvp;
			});
	}

	async deleteRESTCalendarEventRsvp(
		channelId: string,
		calendarEventId: string,
		userId: string,
	): Promise<boolean> {
		const exCalEvent =
			this.getCalendarEvent(channelId, calendarEventId) ??
			(await this.getRESTCalendarEvent(channelId, calendarEventId));
		return await this.router.calendarEventRsvps
			.delete(channelId, calendarEventId, userId)
			.then(() => {
				exCalEvent.rsvps.delete(userId);
				return true;
			});
	}

	async addRESTReactionToMessage(
		channelId: string,
		messageId: string,
		emoteId: string,
		cache = true,
	): Promise<BaseReaction> {
		const exMessage =
			this.getChatMessage(channelId, messageId) ??
			(await this.getRESTChatMessage(channelId, messageId));
		return await this.router.reactions
			.addOnContent(channelId, messageId, emoteId)
			.then(() => ({
				reactedBy: this.user?.id as string,
				emoteId: emoteId,
			}))
			.then((reaction: BaseReaction) => {
				if (
					cache &&
					!exMessage.reactions.find(
						(Re) =>
							Re.emoteId === reaction.emoteId && Re.reactedBy === reaction.reactedBy,
					)
				)
					exMessage.reactions.push(reaction);
				return reaction;
			});
	}

	async deleteRESTReactionFromMessage(
		channelId: string,
		messageId: string,
		emoteId: string,
	): Promise<boolean> {
		const exMessage =
			this.getChatMessage(channelId, messageId) ??
			(await this.getRESTChatMessage(channelId, messageId));
		return await this.router.reactions
			.deleteFromContent(channelId, messageId, emoteId)
			.then(() => {
				exMessage.reactions = exMessage.reactions.filter(
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
		const exForumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		return await this.router.reactions
			.addOnForumTopic(channelId, forumTopicId, emoteId)
			.then(() => ({
				reactedBy: this.user?.id as string,
				emoteId: emoteId,
			}))
			.then((reaction: BaseReaction) => {
				if (
					cache &&
					!exForumTopic.reactions.find(
						(Re) =>
							Re.emoteId === reaction.emoteId && Re.reactedBy === reaction.reactedBy,
					)
				)
					exForumTopic.reactions.push(reaction);
				return reaction;
			});
	}

	async deleteRESTReactionFromForumTopic(
		channelId: string,
		forumTopicId: string,
		emoteId: string,
	): Promise<boolean> {
		const exForumTopic =
			this.getForumTopic(channelId, forumTopicId) ??
			(await this.getRESTForumTopic(channelId, forumTopicId));
		return await this.router.reactions
			.deleteFromForumTopic(channelId, forumTopicId, emoteId)
			.then(() => {
				exForumTopic.reactions = exForumTopic.reactions.filter(
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
		const exForumTopicComment =
			this.getForumTopicComment(channelId, forumTopicId, forumTopicCommentId) ??
			(await this.getRESTForumTopicComment(channelId, forumTopicId, forumTopicCommentId));
		return await this.router.reactions
			.addOnForumTopicComment(channelId, forumTopicId, forumTopicCommentId, emoteId)
			.then(() => ({
				reactedBy: this.user?.id as string,
				emoteId: emoteId,
			}))
			.then((reaction: BaseReaction) => {
				if (
					cache &&
					!exForumTopicComment.reactions.find(
						(Re) =>
							Re.emoteId === reaction.emoteId && Re.reactedBy === reaction.reactedBy,
					)
				)
					exForumTopicComment.reactions.push(reaction);
				return reaction;
			});
	}

	async deleteRESTReactionFromForumTopicComment(
		channelId: string,
		forumTopicId: string,
		forumTopicCommentId: string,
		emoteId: string,
	): Promise<BaseReaction> {
		const exForumTopicComment =
			this.getForumTopicComment(channelId, forumTopicId, forumTopicCommentId) ??
			(await this.getRESTForumTopicComment(channelId, forumTopicId, forumTopicCommentId));
		return await this.router.reactions
			.deleteFromForumTopicComment(channelId, forumTopicId, forumTopicCommentId, emoteId)
			.then(() => ({
				reactedBy: this.user?.id as string,
				emoteId: emoteId,
			}))
			.then((reaction: BaseReaction) => {
				exForumTopicComment.reactions = exForumTopicComment.reactions.filter(
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
		const exMember =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		return await this.router.serverXps
			.awardToMember(serverId, userId, { amount: amount })
			.then((res) => {
				exMember._update({ xp: res.total });
				return exMember;
			});
	}

	async awardXPRESTToServerRole(
		serverId: string,
		roleId: string,
		amount: number,
	): Promise<boolean> {
		if (!this.getServer(serverId)) await this.getRESTServer(serverId);
		return await this.router.serverXps.awardToRole(serverId, roleId, { amount: amount });
	}

	async editXPRESTToServerMember(
		serverId: string,
		userId: string,
		amount: number,
	): Promise<Member> {
		const exMember =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		return await this.router.serverXps
			.updateToMember(serverId, userId, { total: amount })
			.then((res) => {
				exMember._update({ xp: res.total });
				return exMember;
			});
	}

	async getRESTServerMemberSocialLinks(
		serverId: string,
		userId: string,
		type: string,
		cache = true,
	): Promise<ApiBaseSocialLinks> {
		const exMember =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		return await this.router.members.fetchSocialLinks(serverId, userId, type).then((res) => {
			if (cache) exMember.socialLinks.push(res);
			return res;
		});
	}

	async addRESTMemberToGroup(groupId: string, userId: string): Promise<boolean> {
		return this.router.groupMemberships.add(groupId, userId);
	}

	async removeRESTMemberToGroup(groupId: string, userId: string): Promise<boolean> {
		return this.router.groupMemberships.remove(groupId, userId);
	}

	getMemberRoles(serverId: string, userId: string): Array<string> | undefined {
		const exMember = this.getServerMember(serverId, userId);
		if (!exMember) return undefined;
		else return exMember.roleIds;
	}

	async getRESTMemberRoles(
		serverId: string,
		userId: string,
		cache = true,
	): Promise<Array<string>> {
		const exMember =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		return await this.router.roleMemberships.fetch(serverId, userId).then((res) => {
			if (cache) exMember._update({ roleIds: res });
			return res.map((role) => role?.toString());
		});
	}

	async addRESTRoleToMember(serverId: string, userId: string, roleId: string): Promise<Member> {
		const exMember =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		return await this.router.roleMemberships.add(serverId, userId, roleId).then(() => {
			exMember.roleIds?.push(roleId);
			return exMember;
		});
	}

	async removeRESTRoleFromMember(
		serverId: string,
		userId: string,
		roleId: string,
	): Promise<Member> {
		const exMember =
			this.getServerMember(serverId, userId) ??
			(await this.getRESTServerMember(serverId, userId));
		return await this.router.roleMemberships.remove(serverId, userId, roleId).then(() => {
			exMember.roleIds = exMember.roleIds?.filter((id) => id.trim() !== roleId.trim());
			return exMember;
		});
	}

	getServerWebhooks(serverId: string): Collection<string, Webhook> | undefined {
		const server = this.getServer(serverId);
		if (!server) return undefined;
		else return server.webhooks;
	}

	getChannelWebhooks(channelId: string): Collection<string, Webhook> | undefined {
		const channel = this.getChannel<WebhookSupportedChannel>(channelId);
		if (!channel) return undefined;
		else return channel.webhooks;
	}

	getWebhook(serverId: string, webhookId: string): Webhook | undefined {
		const exWebhooks = this.getServerWebhooks(serverId);
		if (!exWebhooks) return undefined;
		else return exWebhooks.get(webhookId);
	}

	async getRESTWebhooks(
		serverId: string,
		channelId?: string,
		cache = true,
	): Promise<Array<Webhook>> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		return await this.router.webhooks
			.fetchAll(serverId, channelId ? { channelId: channelId } : undefined)
			.then((res) =>
				res.map((wH) => {
					let exWebhook = this.getWebhook(serverId, wH.id);
					if (!exWebhook) exWebhook = new Webhook(this, wH);
					else exWebhook._update(wH);
					if (cache) server.webhooks.add(exWebhook.id, exWebhook, true);
					return exWebhook;
				}),
			);
	}

	async getRESTWebhook(serverId: string, webhoookId: string, cache = true): Promise<Webhook> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		let exWebhook = this.getWebhook(serverId, webhoookId);
		return await this.router.webhooks.fetch(serverId, webhoookId).then((res) => {
			if (!exWebhook) exWebhook = new Webhook(this, res);
			else exWebhook._update(res);
			if (cache) server.webhooks.add(exWebhook.id, exWebhook, true);
			return exWebhook;
		});
	}

	async createRESTWebhook(serverId: string, channelId: string, name: string): Promise<Webhook> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		return await this.router.webhooks.create(serverId, { channelId, name }).then((res) => {
			let exWebhook = this.getWebhook(serverId, res.id);
			if (!exWebhook) exWebhook = new Webhook(this, res);
			else exWebhook._update(res);
			server.webhooks.add(exWebhook.id, exWebhook, true);
			return exWebhook;
		});
	}

	async editRESTWebhook(
		serverId: string,
		webhookId: string,
		payload: restWebhookUpdatePayload,
	): Promise<Webhook> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		let exWebhook = this.getWebhook(serverId, webhookId);
		return await this.router.webhooks.update(serverId, webhookId, payload).then((res) => {
			if (!exWebhook) exWebhook = new Webhook(this, res);
			else exWebhook._update(res);
			server.webhooks.add(exWebhook.id, exWebhook, true);
			return exWebhook;
		});
	}

	async deleteRESTWebhook(serverId: string, webhookId: string): Promise<boolean> {
		const server = this.getServer(serverId) ?? (await this.getRESTServer(serverId));
		return await this.router.webhooks.delete(serverId, webhookId).then(() => {
			server.webhooks.delete(webhookId);
			return true;
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
