import { Channel } from '../structures/channels';
import { Doc } from '../structures/docs';
import { Message } from '../structures/messages';
import { Member, Server, MemberBan } from '../structures/servers';
import { User } from '../structures/users';
import { Webhook } from '../structures/webhooks';

export type ClientEvents = {
	ready: () => unknown;
	botJoined: (server: Server, joinedBy: User) => unknown;
	botRemoved: (server: Server, removedBy: User) => unknown;
	messageCreated: (message: Message) => unknown;
	messageUpdated: (message: Message) => unknown;
	messageDeleted: (message: Message) => unknown;
	ServerMemberJoined: (member: Member) => unknown;
	ServerMemberKicked: (member: Member | { id: string; server: Server }) => unknown;
	ServerMemberBanned: (
		member: Member | { id: string; user: User; server: Server },
		ban: MemberBan,
	) => unknown;
	ServerMemberUnBanned: (
		member: Member | { id: string; user: User; server: Server },
		ban: MemberBan,
	) => unknown;
	ServerMemberUpdated: (member: Member) => unknown;
	ServerRolesUpdated: (roleIds: Array<string>) => unknown;
	ServerMemberRolesUpdated: (member: Member) => unknown;
	ServerChannelCreated: (channel: Channel) => unknown;
	ServerChannelUpdated: (channel: Channel) => unknown;
	ServerChannelDeleted: (channel: Channel) => unknown;
	ServerWebhookCreated: (webhook: Webhook) => unknown;
	ServerWebhookUpdated: (webhook: Webhook) => unknown;
	DocCreated: (doc: Doc) => unknown;
};
