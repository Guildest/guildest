import {
	ApiCalendarEvent,
	ApiBaseMentions,
	ApiCalendarEventCancellation,
	ApiCalendarEventRsvp,
	ApiCalendarEventRsvpStatusType,
} from '@guildest/api-typings';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';

export class CalendarEvent extends Base<ApiCalendarEvent, number> {
	serverId: string;
	channelId: string;
	name?: string;
	description?: string;
	location?: string;
	relatedUrl?: string;
	color?: number;
	rsvpLimit?: number;
	startsAt: number;
	duration?: number;
	isPrivate?: boolean;
	mentions?: ApiBaseMentions;
	createdAt: number;
	createdBy: string;
	cancellation?: ApiCalendarEventCancellation;
	constructor(client: Client, json: ApiCalendarEvent) {
		super(client, json);
		this.serverId = json.serverId;
		this.channelId = json.channelId;
		this.startsAt = Date.parse(json.startsAt);
		this.createdAt = Date.parse(json.createdAt);
		this.createdBy = json.createdBy;

		this.__update(json);
	}

	__update(json: Partial<ApiCalendarEvent>) {
		if ('name' in json) this.name = json.name;
		if ('description' in json) this.description = json.description;
		if ('location' in json) this.location = json.location;
		if ('url' in json) this.relatedUrl = json.url;
		if ('color' in json) this.color = json.color;
		if ('rsvpLimit' in json) this.rsvpLimit = json.rsvpLimit;
		if ('duration' in json) this.duration = json.duration;
		if ('isPrivate' in json) this.isPrivate = json.isPrivate;
		if ('mentions' in json) this.mentions = json.mentions;
		if ('cancellation' in json) this.cancellation = json.cancellation;
	}
}

export class CalendarEventRsvp {
	calendarEventId: number;
	channelId: string;
	serverId: string;
	userId: string;
	status?: ApiCalendarEventRsvpStatusType;
	createdBy: string;
	createdAt: number;
	updatedBy?: string;
	updatedAt?: number;
	constructor(public readonly client: Client, json: ApiCalendarEventRsvp) {
		this.calendarEventId = json.calendarEventId;
		this.channelId = json.channelId;
		this.serverId = json.serverId;
		this.userId = json.userId;
		this.createdAt = Date.parse(json.createdAt);
		this.createdBy = json.createdBy;

		this.__update(json);
	}

	__update(json: Partial<ApiCalendarEventRsvp>) {
		if ('updatedBy' in json) this.updatedBy = json.updatedBy;
		if ('status' in json) this.status = json.status;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
	}
}

export { ApiCalendarEventRsvpStatusType as CalendarEventRsvpStatuses } from '@guildest/api-typings';
