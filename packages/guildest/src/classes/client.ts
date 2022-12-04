import EventEmitter from 'events';
import {} from '@guildest/ws'

export class Client extends EventEmitter {
	constructor(public readonly options: string) {
		super();
	}
}
