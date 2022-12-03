import type { ApiBaseClientUser } from '@guildest/api-typings';

export class Base {
	constructor(public readonly client: ApiBaseClientUser, public readonly id: string) {}
}
