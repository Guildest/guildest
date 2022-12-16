import { Server } from '../structures/servers';
import { User } from '../structures/users';

export type ClientEvents = {
	ready: () => unknown;
	botJoined: (server: Server, joinedBy: User) => unknown;
};
