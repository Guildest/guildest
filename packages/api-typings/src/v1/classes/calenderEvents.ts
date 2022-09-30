import { ApiBaseMentions } from './base';

export interface ApiCalenderEventPayload {
	name?: string;
	description?: string;
	location?: string;
	startsAt?: string;
	url?: string;
	color?: number;
	rsvpLimit?: number;
	duration?: number;
	isPrivate?: boolean;
}

export interface ApiCalenderEventCancellation {
	description?: string;
	createdBy: string;
}

export interface ApiCalenderEvent extends ApiCalenderEventPayload {
	id: number;
	serverId: string;
	channelId: string;
	name: string;
	startsAt: string;
	mentions?: ApiBaseMentions;
	createdAt: string;
	createdBy: string;
	cancellation?: ApiCalenderEventCancellation;
}

export enum ApiCalenderEventRsvpStatusType {
	Going = 'going',
	Maybe = 'maybe',
	Decilned = 'declined',
	Invited = 'invited',
	Waitlisted = 'waitlisted',
	NotResponded = 'not responsed',
}

export interface ApiCalenderEventRsvpPayload {
	status: ApiCalenderEventRsvpStatusType;
}

export interface ApiCalenderEventRsvp extends ApiCalenderEventRsvpPayload {
	calendarEventId: number;
	channelId: string;
	serverId: string;
	userId: string;
	createdBy: string;
	createdAt: string;
	updatedBy?: string;
	updatedAt?: string;
}
