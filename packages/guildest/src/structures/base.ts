import { Client } from './client';

/**
 * @class Base Class Represents the Interfaces of Base Model in Guilded API in Server.
 */
export class Base<T = { id: string }, K = string> {
	/** Id of the Class as detemined */
	public id: K;

	/**
	 * Represents the Base Class of the API Channel on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example base = new Base(client,data)
	 */
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
