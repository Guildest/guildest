import { restManager } from '../restManager';
import { CalendarEventRouter, CalendarEventRsvpRouter } from '../routers/calenderEventRouter';
import { ChannelRouter } from '../routers/channelRouter';
import { DocsRouter } from '../routers/docRouter';
import { ForumTopicRouter } from '../routers/forumTopicRouter';
import { GroupMembershipRouter } from '../routers/groupMembershipRouter';
import { MemberRouter } from '../routers/memberRouter';
import { MessageRouter } from '../routers/messageRouter';
import { ReactionRouter } from '../routers/reactionRouter';
import { RoleMembershipRouter } from '../routers/roleMembershipRouter';
import { ServerBansRouter } from '../routers/serverBansRouter';
import { ServerRouter } from '../routers/serverRouter';
import { ServerXPRouter } from '../routers/serverXpRouter';
import { SocialLinkRouter } from '../routers/socialLinkRouter';
import { WebhookRouter } from '../routers/webhookRouter';

/**
 * The Router Manager for the Guilded REST API.
 * @example new router(rest);
 */

export class router {
	/** The Channel router for the Guilded REST API. */
	public readonly channels: ChannelRouter;
	/** The Server router for the Guilded REST API. */
	public readonly servers: ServerRouter;
	/** The Calender Events router for the Guilded REST API. */
	public readonly calenderEvents: CalendarEventRouter;
	/** The Calender Event Rsvps router for the Guilded REST API. */
	public readonly calenderEventRsvps: CalendarEventRsvpRouter;
	/** The Docs router for the Guilded REST API. */
	public readonly docs: DocsRouter;
	/** The Forum Topic router for the Guilded REST API. */
	public readonly forumTopics: ForumTopicRouter;
	/** The Group Membership router for the Guilded REST API. */
	public readonly groupMemberships: GroupMembershipRouter;
	/** The Members router for the Guilded REST API. */
	public readonly members: MemberRouter;
	/** The Role Memberships router for the Guilded REST API. */
	public readonly rolesMemberships: RoleMembershipRouter;
	/** The Messages router for the Guilded REST API. */
	public readonly messages: MessageRouter;
	/** The Reactions router for the Guilded REST API. */
	public readonly reactions: ReactionRouter;
	/** The Server Xp router for the Guilded REST API. */
	public readonly serverXP: ServerXPRouter;
	/** The Server Bans router for the Guilded REST API. */
	public readonly serverBans: ServerBansRouter;
	/** The Social Links router for the Guilded REST API. */
	public readonly socialLinks: SocialLinkRouter;
	/** The Webhook router for the Guilded REST API. */
	public readonly webhooks: WebhookRouter;

	/** @param rest The REST API manager that owns this router. */
	constructor(public readonly rest: restManager) {
		this.channels = new ChannelRouter(rest);
		this.servers = new ServerRouter(rest);
		this.calenderEvents = new CalendarEventRouter(rest);
		this.calenderEventRsvps = new CalendarEventRsvpRouter(rest);
		this.docs = new DocsRouter(rest);
		this.forumTopics = new ForumTopicRouter(rest);
		this.groupMemberships = new GroupMembershipRouter(rest);
		this.members = new MemberRouter(rest);
		this.rolesMemberships = new RoleMembershipRouter(rest);
		this.messages = new MessageRouter(rest);
		this.reactions = new ReactionRouter(rest);
		this.serverBans = new ServerBansRouter(rest);
		this.serverXP = new ServerXPRouter(rest);
		this.socialLinks = new SocialLinkRouter(rest);
		this.webhooks = new WebhookRouter(rest);
	}
}
