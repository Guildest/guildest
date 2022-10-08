import type { ApiBaseClientUser } from '@guildest/guilded-api-typings';

export class Base {
	constructor(public readonly client: ApiBaseClientUser, public readonly id: string) {}
}
