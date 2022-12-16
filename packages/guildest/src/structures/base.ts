import { Client } from './client';

export class Base<T = { id: string }, K = string> {
	public id: K;

	constructor(public readonly client: Client, json: { id: K } & T) {
		this.id = json.id;
	}
}

export interface BaseReaction {
	reactedBy: string;
	emoteId: string;
}
