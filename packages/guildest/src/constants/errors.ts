export type GuildedApiErrorTypeResolve =
	| 'invalid_channel'
	| 'invalid_chat_message'
	| 'invalid_server'
	| 'invalid_server_member'
	| 'invalid_forum_topic'
	| 'invalid_list_item'
	| 'invalid_calendar_event'
	| 'invalid_forum_topic_comment'
	| 'default';

export type GuildedAPIErrorObjectResolve = {
	name?: string;
	message?: string;
	meta?: Record<string, any>;
};

export class GuildedAPIError extends Error {
	constructor(
		type: GuildedApiErrorTypeResolve = 'default',
		object?: GuildedAPIErrorObjectResolve,
	) {
		const data = GuildeAPIErrorTypeSwitches(type);
		super(object?.message ?? data.message);
		this.name = `Guilded API Error : [ ${object?.name ?? data?.name} ]`;
	}
}

export function GuildeAPIErrorTypeSwitches(type: GuildedApiErrorTypeResolve = 'default') {
	switch (type.toLowerCase().trim()) {
		case 'invalid_channel':
			return {
				name: 'Invalid Channel',
				message:
					'Missing or Invalid Channel has been encountered during REST API Requests.',
			};
		case 'invalid_chat_message':
			return {
				name: 'Invalid Chat Message',
				message:
					'Missing or Invalid Chat Message has been encountered during REST API Requests.',
			};
		case 'invalid_server':
			return {
				name: 'Invalid Server',
				message: 'Missing or Invalid Server has been encountered during REST API Requests.',
			};
		case 'invalid_server_member':
			return {
				name: 'Invalid Server Member',
				message:
					'Missing or Invalid Server Member has been encountered during REST API Requests.',
			};
		case 'invalid_forum_topic':
			return {
				name: 'Invalid Forum Forum',
				message:
					'Missing or Invalid Forum Forum has been encountered during REST API Requests.',
			};
		case 'invalid_list_item':
			return {
				name: 'Invalid List Item',
				message:
					'Missing or Invalid List Item has been encountered during REST API Requests.',
			};
		case 'invalid_calendar_event':
			return {
				name: 'Invalid Calendar Event',
				message:
					'Missing or Invalid Calendar Event has been encountered during REST API Requests.',
			};
		case 'invalid_forum_topic_comment':
			return {
				name: 'Invalid Forum Topic Comment',
				message:
					'Missing or Invalid Forum Topic Comment has been encountered during REST API Requests.',
			};
		case 'default':
			return {
				name: 'Internal or Process Error',
				message: 'Internal Encountered Error or Process emitter or REST API Related Error',
			};
		default:
			return {
				name: 'Unknown Error',
				message:
					'Internal Unkownn Encountered Error | Please Contact Library Maintainer with Logs',
			};
	}
}
