import {
	eventBotServerMembershipCreated,
	eventBotServerMembershipDeleted,
	eventCalendarEventCreated,
	eventChatMessageCreated,
	eventChatMessageDeleted,
	eventChatMessageUpdated,
	eventDocCreated,
	eventDocDeleted,
	eventDocUpdated,
	eventServerChannelCreated,
	eventServerChannelDeleted,
	eventServerChannelUpdated,
	eventServerMemberBanned,
	eventServerMemberJoined,
	eventServerMemberRemoved,
	eventServerMemberUnBanned,
	eventServerMemberUpdated,
	eventServerRolesUpdated,
	eventServerWebhookCreated,
	eventServerWebhookUpdated,
} from '@guildest/api-typings';
import { Client } from '../structures/client';
import { Member, MemberBan, Server } from '../structures/servers';
import { Message } from '../structures/messages';
import { User } from '../structures/users';
import { Channel } from '../structures/channels';
import { Webhook } from '../structures/webhooks';
import { Doc } from '../structures/docs';

export class eventsHandler {
	constructor(public readonly client: Client) {}
	events = {
		BotServerMembershipCreated: async ({
			server,
			createdBy,
		}: eventBotServerMembershipCreated) => {
			let rServer = this.client.getServer(server.id);
			if (!rServer) rServer = new Server(this.client, server);
			else rServer._update(server);
			const createdByUser =
				this.client.getServerMember(server.id, createdBy) ??
				(await this.client.getRESTServerMember(server.id, createdBy));

			this.client.emit('botJoined', rServer, createdByUser.user);
		},
		BotServerMembershipDeleted: async ({
			server,
			deletedBy,
		}: eventBotServerMembershipDeleted) => {
			let rServer = this.client.getServer(server.id);
			if (!rServer) rServer = new Server(this.client, server);
			else rServer._update(server);
			const deleteddByUser =
				this.client.getServerMember(server.id, deletedBy) ??
				(await this.client.getRESTServerMember(server.id, deletedBy));

			this.client.emit('botRemoved', rServer, deleteddByUser.user);
		},
		ChatMessageCreated: async ({ serverId, message }: eventChatMessageCreated) => {
			if (!this.client.getServer(serverId)) await this.client.getRESTServer(serverId);
			let rMessage = this.client.getChatMessage(serverId, message.id);
			if (!rMessage) rMessage = new Message(this.client, message);
			else rMessage._update(message);
			rMessage.channel?.messages.add(rMessage.id, rMessage, true);

			this.client.emit('messageCreated', rMessage);
		},
		ChatMessageUpdated: async ({ serverId, message }: eventChatMessageUpdated) => {
			if (!this.client.getServer(serverId)) await this.client.getRESTServer(serverId);
			let rMessage = this.client.getChatMessage(serverId, message.id);
			if (!rMessage) rMessage = new Message(this.client, message);
			else rMessage._update(message);
			rMessage.channel?.messages.add(rMessage.id, rMessage, true);

			this.client.emit('messageUpdated', rMessage);
		},
		ChatMessageDeleted: async ({ serverId, message }: eventChatMessageDeleted) => {
			if (!this.client.getServer(serverId)) await this.client.getRESTServer(serverId);
			let channel =
					this.client.getChannel(message.channelId) ??
					(await this.client.getRESTChannel(message.channelId)),
				rMessage =
					this.client.getChatMessage(message.channelId, message.id) ??
					new Message(this.client, message);
			if (channel) channel.messages.delete(message.id);

			this.client.emit('messageDeleted', rMessage);
		},
		ServerMemberJoined: async ({ serverId, member }: eventServerMemberJoined) => {
			const server =
				this.client.getServer(serverId) ?? (await this.client.getRESTServer(serverId));
			let rMember = this.client.getServerMember(serverId, member.user.id);
			if (!rMember) rMember = new Member(this.client, { ...member, serverId });
			else rMember._update({ ...member, serverId });
			if (server && rMember) server.members.add(rMember.id, rMember, true);

			this.client.emit('ServerMemberJoined', rMember);
		},
		ServerMemberRemoved: async ({ serverId, userId, isKick }: eventServerMemberRemoved) => {
			const server =
				this.client.getServer(serverId) ?? (await this.client.getRESTServer(serverId));
			let rMember: Member | { id: string; server: Server } | undefined =
				this.client.getServerMember(serverId, userId);
			if (rMember && server) server?.members.delete(userId);
			else rMember = { id: userId, server: server };

			if (isKick) this.client.emit('ServerMemberKicked', rMember);
			else return;
		},
		ServerMemberBanned: async ({ serverId, serverMemberBan }: eventServerMemberBanned) => {
			const server =
				this.client.getServer(serverId) ?? (await this.client.getRESTServer(serverId));
			let rMember: Member | { id: string; user: User; server: Server } | undefined =
					this.client.getServerMember(serverId, serverMemberBan.user.id),
				ban = new MemberBan(this.client, serverMemberBan);
			if (!rMember)
				rMember = {
					id: serverMemberBan.user.id,
					user: new User(this.client, serverMemberBan.user),
					server: server,
				};
			if (server && rMember) server.members.delete(rMember.id);
			if (server && ban) server.bans.add(ban.id, ban, true);
			this.client.emit('ServerMemberBanned', rMember, ban);
		},
		ServerMemberUnbanned: async ({ serverId, serverMemberBan }: eventServerMemberUnBanned) => {
			const server =
				this.client.getServer(serverId) ?? (await this.client.getRESTServer(serverId));
			let rMember: Member | { id: string; user: User; server: Server } | undefined =
					this.client.getServerMember(serverId, serverMemberBan.user.id),
				ban = new MemberBan(this.client, serverMemberBan);
			if (!rMember)
				rMember = {
					id: serverMemberBan.user.id,
					user: new User(this.client, serverMemberBan.user),
					server: server,
				};
			if (server && ban) server.bans.delete(ban.id);
			this.client.emit('ServerMemberUnBanned', rMember, ban);
		},
		ServerMemberUpdated: async ({ serverId, userInfo }: eventServerMemberUpdated) => {
			const server =
				this.client.getServer(serverId) ?? (await this.client.getRESTServer(serverId));
			let rMember =
				this.client.getServerMember(serverId, userInfo.id) ??
				(await this.client.getRESTServerMember(serverId, userInfo.id));
			rMember._update({ ...userInfo });
			server.members.add(rMember.id, rMember, true);

			this.client.emit('ServerMemberUpdated', rMember);
		},
		ServerRolesUpdated: async ({ serverId, memberRoleIds }: eventServerRolesUpdated) => {
			const server =
				this.client.getServer(serverId) ?? (await this.client.getRESTServer(serverId));
			let roleIds = new Array<string>();
			memberRoleIds.forEach((object) => {
				roleIds.push(...object.roleIds.map((r) => r.toString()));
				let rMember = this.client.getServerMember(serverId, object.userId);
				if (rMember) {
					rMember._update({ roleIds: object.roleIds });
					server.members.add(rMember.id, rMember, true);
					this.client.emit('ServerMemberRolesUpdated', rMember);
				}
			});
			this.client.emit('ServerRolesUpdated', roleIds);
		},
		ServerChannelCreated: async ({ serverId, channel }: eventServerChannelCreated) => {
			const server =
				this.client.getServer(serverId) ?? (await this.client.getRESTServer(serverId));
			let rChannel = this.client.getChannel(channel.id);
			if (!rChannel) rChannel = new Channel(this.client, channel);
			else rChannel._update(channel);
			server.channels.add(rChannel.id, rChannel, true);

			this.client.emit('ServerChannelCreated', rChannel);
		},
		ServerChannelUpdated: async ({ serverId, channel }: eventServerChannelUpdated) => {
			const server =
				this.client.getServer(serverId) ?? (await this.client.getRESTServer(serverId));
			let rChannel = this.client.getChannel(channel.id);
			if (!rChannel) rChannel = new Channel(this.client, channel);
			else rChannel._update(channel);
			server.channels.add(rChannel.id, rChannel, true);

			this.client.emit('ServerChannelUpdated', rChannel);
		},
		ServerChannelDeleted: async ({ serverId, channel }: eventServerChannelDeleted) => {
			const server =
				this.client.getServer(serverId) ?? (await this.client.getRESTServer(serverId));
			let rChannel = this.client.getChannel(channel.id);
			if (!rChannel) rChannel = new Channel(this.client, channel);
			else rChannel._update(channel);
			server.channels.delete(rChannel.id);

			this.client.emit('ServerChannelDeleted', rChannel);
		},
		ServerWebhookCreated: async ({ serverId, webhook }: eventServerWebhookCreated) => {
			const server =
				this.client.getServer(serverId) ?? (await this.client.getRESTServer(serverId));
			let rWebhook = this.client.getWebhook(serverId, webhook.id);
			if (!rWebhook) rWebhook = new Webhook(this.client, webhook);
			else rWebhook._update(webhook);
			server.webhooks.add(rWebhook.id, rWebhook, true);

			this.client.emit('ServerWebhookCreated', rWebhook);
		},
		ServerWebhookUpdated: async ({ serverId, webhook }: eventServerWebhookUpdated) => {
			const server =
				this.client.getServer(serverId) ?? (await this.client.getRESTServer(serverId));
			let rWebhook = this.client.getWebhook(serverId, webhook.id);
			if (!rWebhook) rWebhook = new Webhook(this.client, webhook);
			else rWebhook._update(webhook);
			server.webhooks.add(rWebhook.id, rWebhook, true);

			this.client.emit('ServerWebhookUpdated', rWebhook);
		},
		DocCreated: async ({ doc }: eventDocCreated) => {
			const channel =
				this.client.getChannel(doc.channelId) ??
				(await this.client.getRESTChannel(doc.channelId));
			let rDoc = this.client.getDoc(doc.channelId, doc.id.toString());
			if (!rDoc) rDoc = new Doc(this.client, doc);
			else rDoc._update(doc);
			channel.docs.add(rDoc.id, rDoc, true);

			this.client.emit('DocCreated', rDoc);
		},
		DocUpdated: async ({ doc }: eventDocUpdated) => {
			const channel =
				this.client.getChannel(doc.channelId) ??
				(await this.client.getRESTChannel(doc.channelId));
			let rDoc = this.client.getDoc(doc.channelId, doc.id.toString());
			if (!rDoc) rDoc = new Doc(this.client, doc);
			else rDoc._update(doc);
			channel.docs.add(rDoc.id, rDoc, true);

			this.client.emit('DocUpdated', rDoc);
		},
		DocDeleted: async ({ doc }: eventDocDeleted) => {
			const channel =
				this.client.getChannel(doc.channelId) ??
				(await this.client.getRESTChannel(doc.channelId));
			let rDoc = this.client.getDoc(doc.channelId, doc.id.toString());
			if (!rDoc) rDoc = new Doc(this.client, doc);
			else rDoc._update(doc);
			channel.docs.delete(rDoc.id);

			this.client.emit('DocDeleted', rDoc);
		},
		CalendarEventCreated: async ({}: eventCalendarEventCreated) => {},
	};
}
