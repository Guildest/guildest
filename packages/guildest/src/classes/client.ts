import EventEmitter from 'events';
import {} from '@guildest/rest/src/v1';

export class Client extends EventEmitter {
	constructor(public readonly options: string) {
		super();
	}
}
