import { Client } from './client';

export class Base<T = { id: string }, K = string> {
	public id: K;
	public __orignal: T;

	constructor(public readonly client: Client, json: { id: K } & T) {
		this.id = json.id;
		this.__orignal = json;
	}
}
