import {
	ApiCalendarEvent,
	ApiBaseMentions,
	ApiCalendarEventCancellation,
	ApiCalendarEventRsvp,
	ApiCalendarEventRsvpStatusType,
} from '@guildest/api-typings';
import { Collection } from '@guildest/collection';
import { DateParse } from '../utils/basicUtils';
import { Base } from './base';
import { Client } from './client';

/**
 * @class Calendar Event Class Represents the Interfaces of Calendar Event Model in Guilded API in Server.
 */
export class CalendarEvent extends Base<ApiCalendarEvent, string> {
	/** Represents the Server Id on Guilded API. */
	serverId: string;
	/** Represents the Channel Id of the Calendar Event on Guilded API. */
	channelId: string;
	/** Represents the name of the Calendar Event on Guilded API. */
	name?: string;
	/** Represents the description of the Calendar Event on Guilded API. */
	description?: string;
	/** Collection of rsvps of the Calendar Event on Guilded API. */
	rsvps = new Collection<string, CalendarEventRsvp>();
	/** Represents the location of the Calendar Event on Guilded API. */
	location?: string;
	/** Represents the relatedUri of the Calendar Event on Guilded API. */
	relatedUrl?: string;
	/** Represents the color numeric value of the Calendar Event on Guilded API. */
	color?: number;
	/** Represents the rsvp Limit Value of the Calendar Event on Guilded API. */
	rsvpLimit?: number;
	/** Represents the starting of the event timestamp in ms of the Calendar Event on Guilded API. */
	startsAt: number;
	/** Represents the event duration of the Calendar Event on Guilded API. */
	duration?: number;
	/** Represents the if private evenbt in boolean of the Calendar Event on Guilded API. */
	isPrivate?: boolean;
	/** Represents the mentions related to the Calendar Event on Guilded API. */
	mentions?: ApiBaseMentions;
	/** Represents the Created At timestamp at ms from Guilded. */
	createdAt: number;
	/** Represents the Created By User Id of Calendar Event from Guilded. */
	createdById: string;
	/** Represents the Cancellation Object Data of Calendar Event from Guilded. */
	cancellation?: ApiCalendarEventCancellation;

	/**
	 * Represents the Calendar Event Class of the API Channel on Guilded.
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 * @example calendarEvent = new CalendarEvent(client,data)
	 */
	constructor(client: Client, json: ApiCalendarEvent) {
		super(client, Object.assign({}, json, { id: json.id.toString() }));
		this.serverId = json.serverId;
		this.channelId = json.channelId;
		this.startsAt = Date.parse(json.startsAt);
		this.createdAt = Date.parse(json.createdAt);
		this.createdById = json.createdBy;

		this._update(json);
	}

	/**
	 * Update function for Updating properties with changed data
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	_update(json: Partial<ApiCalendarEvent>) {
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

/**
 * @class Calendar Event Rsvp Class Represents the Interfaces of Calendar Event Rsvp Model in Guilded API in Server.
 */
export class CalendarEventRsvp extends Base<ApiCalendarEventRsvp, string> {
	/** Calendar Event Id of a Calendar Event in Guilded Api */
	calendarEventId: string;
	/** Channel Id of the Calendar Channel in Server in Guilded. */
	channelId: string;
	/** Server Id of the Calendar Channel in Server in Guilded. */
	serverId: string;
	/** User Id of the User who created the Calendar Event */
	userId: string;
	/** Status Type of the Calendar Event in Guilded. */
	status?: ApiCalendarEventRsvpStatusType;
	/** User Id of the User who created the Calendar Event */
	createdById: string;
	/** Timestamp (ms) when created the Calendar Event */
	createdAt: number;
	/** User Id of the User who updated the Calendar Event */
	updatedById?: string;
	/** Timestamp (ms) when updated the Calendar Event */
	updatedAt?: number;

	/**
	 * CalendarEventRsvp Class Instance for the Model
	 * @param client Guildest Client Interacting with REST and Ws using Guilded API .
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	constructor(client: Client, json: ApiCalendarEventRsvp) {
		super(client, Object.assign({}, json, { id: json.userId }));
		this.calendarEventId = json.calendarEventId.toString();
		this.channelId = json.channelId;
		this.serverId = json.serverId;
		this.userId = json.userId;
		this.createdAt = Date.parse(json.createdAt);
		this.createdById = json.createdBy;

		this._update(json);
	}

	/**
	 * Update function for Updating properties with changed data
	 * @param json JSON / Record Object Data from REST /  Ws as Raw Data from API
	 */
	_update(json: Partial<ApiCalendarEventRsvp>) {
		if ('updatedBy' in json) this.updatedById = json.updatedBy;
		if ('status' in json) this.status = json.status;
		if ('updatedAt' in json) this.updatedAt = DateParse(json.updatedAt);
	}
}

export { ApiCalendarEventRsvpStatusType as CalendarEventRsvpStatuses } from '@guildest/api-typings';
