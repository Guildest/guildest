import { Client } from './client';

export class Base<T = { id: string }, K = string> {
	public id: K;
	public raw: T;

	constructor(public readonly client: Client, raw: { id: K } & T) {
		this.id = raw.id;
		this.raw = raw;
	}
}
