import {
	AnnouncementChannel,
	CalendarEventChannel,
	Channel,
	ChannelTypes,
	ChatChannel,
	DocChannel,
	ForumChannel,
	ListChannel,
	MediaChannel,
	SchedulingChannel,
	StreamChannel,
	VoiceChannel,
} from '../structures/channels';

/**
 * Parsing of string resolve like ISO string of Date() to timestamp (ms) number
 * @param isoString ISO string value of Date()
 * @returns timestamp (ms) in number or undefined on failure
 * @example DateParse("abc") // 090198
 */
export function DateParse(isoString?: string | number): number | undefined {
	if (!isoString) return undefined;
	else if (typeof isoString === 'number') return isoString;
	else if (!isNaN(parseInt(isoString, 10))) return parseInt(isoString, 10);
	else if (typeof isoString === 'string') return Date.parse(isoString);
	else return undefined;
}

/**
 * Parsing of Channel Types to Channel Class
 * @param type Type of the Channel from API
 * @returns Channel Class respective to the Type or Default Channel
 * @example fetchChannelType("chat") // ChatChannel
 */

export function fetchChannelType(type: ChannelTypes) {
	switch (type) {
		case 'announcements':
			return AnnouncementChannel;
		case 'chat':
			return ChatChannel;
		case 'media':
			return MediaChannel;
		case 'calendar':
			return CalendarEventChannel;
		case 'forums':
			return ForumChannel;
		case 'docs':
			return DocChannel;
		case 'voice':
			return VoiceChannel;
		case 'list':
			return ListChannel;
		case 'scheduling':
			return SchedulingChannel;
		case 'stream':
			return StreamChannel;
		default:
			return Channel;
	}
}
