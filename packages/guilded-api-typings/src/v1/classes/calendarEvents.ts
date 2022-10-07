import { ApiBaseMentions } from './base';

/**
 * Calendar Event Payload for Creation of Update Rest's request
 * @see https://www.guilded.gg/docs/api/calendarEvents/CalendarEventCreate
 */
export interface restCalendarEventPayload {
	/** Name of the Calendar Event */
	name?: string;
	/** Description of the Calendar Event */
	description?: string;
	/** Location of the Calendar Event */
	location?: string;
	/** Start Date/Time ISO-String Value of the Calendar Event */
	startsAt?: string;
	/** A URL to associate with the Calendar Event */
	url?: string;
	/** The color of the event when viewing in the calendar (min 0; max 16777215)  */
	color?: number;
	/** The number of RSVPs to allow before waitlisting RSVPs (min 1) */
	rsvpLimit?: number;
	/** The duration of the event in minutes (min 1) */
	duration?: number;
	/** Represents if Private Boolean Value of Calendar Event */
	isPrivate?: boolean;
}

/**
 * Represents Calendar Event Cancellation Value of the Calendar Event Data
 * @see https://www.guilded.gg/docs/api/calendarEvents/CalendarEvent
 */
export interface ApiCalendarEventCancellation {
	/** Represents The description of event cancellation (min length 1; max length 140) */
	description?: string;
	/** Represents The ID of the user who created this event cancellation */
	createdBy?: string;
}

/**
 * Represents The CalendarEvent on Guilded.
 * @see https://www.guilded.gg/docs/api/calendarEvents/CalendarEvent
 */
export interface ApiCalendarEvent extends restCalendarEventPayload {
	/** Represents Id Value of Calendar Event */
	id: number;
	/** Represents the associated Server Id Value of Calendar Event */
	serverId: string;
	/** Represents the associated Channel Id Value of Calendar Event */
	channelId: string;
	/** Represents the Name of Calendar Event */
	name: string;
	/** Start Time/Date ISO-String value of Calendar Event */
	startsAt: string;
	/** Represents the Related Mentions present with Calendar Events. */
	mentions?: ApiBaseMentions;
	/** Creation Time/Date ISO-String value of Calendar Event */
	createdAt: string;
	/** The ID of the user who created this event  */
	createdBy: string;
	/** Represents the Calendar Event Cancellation Value related to Calendar Event. */
	cancellation?: ApiCalendarEventCancellation;
}

/**
 * Represents the Calendar Event Rsvp Status Type Value
 * @see https://www.guilded.gg/docs/api/calendarEvents/CalendarEventRsvp
 */
export enum ApiCalendarEventRsvpStatusType {
	Going = 'going',
	Maybe = 'maybe',
	Decilned = 'declined',
	Invited = 'invited',
	Waitlisted = 'waitlisted',
	NotResponded = 'not responsed',
}

/**
 * Represents the Calendar Event Rsvp Payload Value
 * @see https://www.guilded.gg/docs/api/calendarEvents/CalendarEventRsvpUpdate
 */
export interface restCalendarEventRsvpPayload {
	/** Represents the Calendar Event Rsvp Payload Value. */
	status: ApiCalendarEventRsvpStatusType;
}

/**
 * Represents the Calendar Event Rsvp Model Value.
 * @see https://www.guilded.gg/docs/api/calendarEvents/CalendarEventRsvp
 */
export interface ApiCalendarEventRsvp extends restCalendarEventRsvpPayload {
	/** Represents the Calendar Event Id */
	calendarEventId: number;
	/** Represents the Associaled Channel's Id of Calendar Event */
	channelId: string;
	/** Represents the Associated Server's Id of Calendar Event */
	serverId: string;
	/** Represents the Associated User's Id of Calendar Event */
	userId: string;
	/** The ID of the user who created this RSVP Calendar Event */
	createdBy: string;
	/**  The ISO 8601 timestamp that the RSVP was created at */
	createdAt: string;
	/** The ID of the user who updated this RSVP */
	updatedBy?: string;
	/** The ISO 8601 timestamp that the RSVP was updated at, if relevant */
	updatedAt?: string;
}
