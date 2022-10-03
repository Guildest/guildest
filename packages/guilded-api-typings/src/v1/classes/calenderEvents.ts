import { ApiBaseMentions } from './base';

/**
 * Calender Event Payload for Creation of Update Rest's request
 * @see https://www.guilded.gg/docs/api/calendarEvents/CalendarEventCreate
 */
export interface ApiCalenderEventPayload {
	/** Name of the Calender Event */
	name?: string;
	/** Description of the Calender Event */
	description?: string;
	/** Location of the Calender Event */
	location?: string;
	/** Start Date/Time ISO-String Value of the Calender Event */
	startsAt?: string;
	/** A URL to associate with the Calender Event */
	url?: string;
	/** The color of the event when viewing in the calendar (min 0; max 16777215)  */
	color?: number;
	/** The number of RSVPs to allow before waitlisting RSVPs (min 1) */
	rsvpLimit?: number;
	/** The duration of the event in minutes (min 1) */
	duration?: number;
	/** Represents if Private Boolean Value of Calender Event */
	isPrivate?: boolean;
}

/**
 * Represents Calender Event Cancellation Value of the Calender Event Data
 * @see https://www.guilded.gg/docs/api/calendarEvents/CalendarEvent
 */
export interface ApiCalenderEventCancellation {
	/** Represents The description of event cancellation (min length 1; max length 140) */
	description?: string;
	/** Represents The ID of the user who created this event cancellation */
	createdBy?: string;
}

/**
 * Represents The CalendarEvent on Guilded.
 * @see https://www.guilded.gg/docs/api/calendarEvents/CalendarEvent
 */
export interface ApiCalenderEvent extends ApiCalenderEventPayload {
	/** Represents Id Value of Calender Event */
	id: number;
	/** Represents the associated Server Id Value of Calender Event */
	serverId: string;
	/** Represents the associated Channel Id Value of Calender Event */
	channelId: string;
	/** Represents the Name of Calender Event */
	name: string;
	/** Start Time/Date ISO-String value of Calender Event */
	startsAt: string;
	/** Represents the Related Mentions present with Calender Events. */
	mentions?: ApiBaseMentions;
	/** Creation Time/Date ISO-String value of Calender Event */
	createdAt: string;
	/** The ID of the user who created this event  */
	createdBy: string;
	/** Represents the Calender Event Cancellation Value related to Calender Event. */
	cancellation?: ApiCalenderEventCancellation;
}

/**
 * Represents the Calender Event Rsvp Status Type Value
 * @see https://www.guilded.gg/docs/api/calendarEvents/CalendarEventRsvp
 */
export enum ApiCalenderEventRsvpStatusType {
	Going = 'going',
	Maybe = 'maybe',
	Decilned = 'declined',
	Invited = 'invited',
	Waitlisted = 'waitlisted',
	NotResponded = 'not responsed',
}

/**
 * Represents the Calender Event Rsvp Payload Value
 * @see https://www.guilded.gg/docs/api/calendarEvents/CalendarEventRsvpUpdate
 */
export interface ApiCalenderEventRsvpPayload {
	/** Represents the Calender Event Rsvp Payload Value. */
	status: ApiCalenderEventRsvpStatusType;
}

/**
 * Represents the Calender Event Rsvp Model Value.
 * @see https://www.guilded.gg/docs/api/calendarEvents/CalendarEventRsvp
 */
export interface ApiCalenderEventRsvp extends ApiCalenderEventRsvpPayload {
	/** Represents the Calender Event Id */
	calendarEventId: number;
	/** Represents the Associaled Channel's Id of Calender Event */
	channelId: string;
	/** Represents the Associated Server's Id of Calender Event */
	serverId: string;
	/** Represents the Associated User's Id of Calender Event */
	userId: string;
	/** The ID of the user who created this RSVP Calender Event */
	createdBy: string;
	/**  The ISO 8601 timestamp that the RSVP was created at */
	createdAt: string;
	/** The ID of the user who updated this RSVP */
	updatedBy?: string;
	/** The ISO 8601 timestamp that the RSVP was updated at, if relevant */
	updatedAt?: string;
}
