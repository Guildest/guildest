import {
	ApiCalendarEvent,
	ApiCalendarEventPayload,
	ApiCalendarEventRsvp,
	ApiCalendarEventRsvpPayload,
	Endpoints,
} from '@guildest/guilded-api-typings';
import { restManager } from '../restManager';

/**
 * The Calendar Event's Router for the Guilded REST Api.
 * @example new CalendarEventRouter(rest)
 */
export class CalendarEventRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Create Request for Calendar Event Router on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param payload The JSON Params for Create Request on Guilded.
	 * @returns Calendar Event Object on Guilded.
	 * @example CalendarEventRouter.create("abc" , { name : "foo" })
	 */

	async create(channelId: string, payload: ApiCalendarEventPayload): Promise<ApiCalendarEvent> {
		return await this.rest
			.post<{ calendarEvent: ApiCalendarEvent }, ApiCalendarEventPayload>(
				Endpoints.calendarEvents(channelId),
				payload,
			)
			?.then((R) => R?.calendarEvent);
	}

	/**
	 * Fetch Request for Single or Many Calendar Event Router on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param calendarEventId The ID of the Calendar Event on Guilded.
	 * @returns Calendar Event Object on Guilded.
	 * @example CalendarEventRouter.fetch("abc" , "foo")
	 */

	async fetch(
		channelId: string,
		calendarEventId?: string,
	): Promise<ApiCalendarEvent | Array<ApiCalendarEvent>> {
		if (calendarEventId)
			return await this.rest
				.get<{ calendarEvent: ApiCalendarEvent }>(
					Endpoints.calendarEvent(channelId, parseInt(calendarEventId)),
				)
				?.then((R) => R?.calendarEvent);
		else
			return await this.rest
				.get<{ calendarEvents: Array<ApiCalendarEvent> }>(
					Endpoints.calendarEvents(channelId),
				)
				?.then((R) => R?.calendarEvents);
	}

	/**
	 * Update Request Calendar Event Router on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param calendarEventId The ID of the Calendar Event on Guilded.
	 * @param payload The JSON Params for Update Calendar Event on Guilded.
	 * @returns Updated Calendar Event Object on Guilded.
	 * @example CalendarEventRouter.update("abc" , "foo" , { name : "bar" })
	 */

	async update(
		channelId: string,
		calendarEventId: string,
		payload: ApiCalendarEventPayload,
	): Promise<ApiCalendarEvent> {
		return await this.rest
			.patch<{ calendarEvent: ApiCalendarEvent }, ApiCalendarEventPayload>(
				Endpoints.calendarEvent(channelId, parseInt(calendarEventId)),
				payload,
			)
			?.then((R) => R?.calendarEvent);
	}

	/**
	 * Delete Request for Calendar Event Router on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param calendarEventId The ID of the Calendar Event on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example CalendarEventRouter.delete("abc" , "foo")
	 */

	async delete(channelId: string, calendarEventId: string): Promise<boolean> {
		return await this.rest
			.delete<void>(Endpoints.calendarEvent(channelId, parseInt(calendarEventId)))
			?.then(() => true);
	}
}

/**
 * The Calendar Event Rsvp's Router for the Guilded REST Api.
 * @example new CalendarEventRsvpRouter(rest)
 */
export class CalendarEventRsvpRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Fetch Request for Single or Many Calendar Event Rsvp Router on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param calendarEventId The ID of the Calendar Event on Guilded.
	 * @param userId The ID of the user of Calender Event on Guilded.
	 * @returns Calendar Event Rsvp Object on Guilded.
	 * @example CalendarEventRsvpRouter.fetch("abc" , "foo" , "bar")
	 */

	async fetch(
		channelId: string,
		calendarEventId: string,
		userId?: string,
	): Promise<ApiCalendarEventRsvp | Array<ApiCalendarEventRsvp>> {
		if (userId)
			return await this.rest
				.get<{ calendarEventRsvp: ApiCalendarEventRsvp }>(
					Endpoints.calendarEventRsvp(channelId, parseInt(calendarEventId), userId),
				)
				?.then((R) => R?.calendarEventRsvp);
		else
			return await this.rest
				.get<{ calendarEventRsvps: Array<ApiCalendarEventRsvp> }>(
					Endpoints.calendarEventRsvps(channelId, parseInt(calendarEventId)),
				)
				?.then((R) => R?.calendarEventRsvps);
	}

	/**
	 * Update Request for Calendar Event Rsvp Router on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param calendarEventId The ID of the Calendar Event on Guilded.
	 * @param userId The ID of the user of Calender Event on Guilded.
	 * @param payload The JSON Params for Update Request on Guilded.
	 * @returns Calendar Event Rsvp Object on Guilded.
	 * @example CalendarEventRsvpRouter.update("abc" , "foo" , "bar" , { status : "going" })
	 */

	async update(
		channelId: string,
		calendarEventId: string,
		userId: string,
		payload: ApiCalendarEventRsvpPayload,
	): Promise<ApiCalendarEventRsvp> {
		return this.rest
			.put<{ calendarEventRsvp: ApiCalendarEventRsvp }, ApiCalendarEventRsvpPayload>(
				Endpoints.calendarEventRsvp(channelId, parseInt(calendarEventId), userId),
				payload,
			)
			?.then((R) => R?.calendarEventRsvp);
	}

	/**
	 * Delete Request for Calendar Event Rsvp Router on Guilded REST API.
	 * @param channelId The ID of the channel on Guilded.
	 * @param calendarEventId The ID of the Calendar Event on Guilded.
	 * @param userId The ID of the user of Calender Event on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example CalendarEventRsvpRouter.delete("abc" , "foo" , "bar")
	 */

	async delete(channelId: string, calendarEventId: string, userId: string): Promise<boolean> {
		return await this.rest
			.delete<void>(Endpoints.calendarEventRsvp(channelId, parseInt(calendarEventId), userId))
			?.then(() => true);
	}
}