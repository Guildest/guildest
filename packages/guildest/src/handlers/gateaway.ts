import { eventBotServerMembershipCreated } from '@guildest/api-typings';
import { Client } from '../structures/client';

export class gateawayHandler {
	constructor(public readonly client: Client) {}
	events = {
		BotServerMembershipCreated: ({
			server,
			createdBy,
		}: eventBotServerMembershipCreated): void => {
			if (!server.id || !createdBy) return undefined;
		},
	};
}
