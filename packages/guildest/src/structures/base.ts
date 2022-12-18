import { Client } from './client';

export class Base<T = { id: string }, K = string> {
	public id: K;

	constructor(public readonly client: Client, json: { id: K } & T) {
		this.id = json.id;
	}

	/**
	 * Taken from https://github.com/discordjs/discord.js/blob/8e8d9b490a71de6cabe6f16375d7549a7c5c3737/src/structures/Base.js#L20
	 * Licensed under the Apache License 2.0 <https://github.com/discordjs/discord.js/blob/8e8d9b490a71de6cabe6f16375d7549a7c5c3737/LICENSE>
	 */
	public _clone(): this {
		return Object.assign(Object.create(this), this);
	}
}

export interface BaseReaction {
	reactedBy: string;
	emoteId: string;
}
