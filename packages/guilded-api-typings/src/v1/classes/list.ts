import type { ApiBase, ApiBaseMentions, ApiBaseListItemNote } from './base';

/**
 * Represents the List Item Summary Value in Guilded.
 * @see https://www.guilded.gg/docs/api/listItems/ListItemSummary
 */
export interface ApiListItemSummary extends ApiBase {
	/** Represent the Server Id of the List Item in Guilded. */
	serverId: string;
	/** Represent the Channel Id of the List Item in Guilded. */
	channelId: string;
	/** Represent the Message of the List Item in Guilded. */
	message: string;
	/** Represent the Mentions Associated of the List Item in Guilded. */
	mentions?: ApiBaseMentions;
	/** Creation Data/Time ISO-String Value of List Item in Guilded. */
	createdAt: string;
	/** The ID of the user who created this list item on Guilded. */
	createdBy: string;
	/** The ID of the webhook who created this list item, if it was created by a webhook */
	createdByWebhookId?: string;
	/** Last Updated Data/Time ISO-String Value on Guilded. */
	updatedAt?: string;
	/** The ID of the user who updated this list item on Guilded. */
	updatedBy?: string;
	/** The ID of the parent list item if this list item is nested */
	parentListItemId?: string;
	/** Completed Data/Time ISO-String Value on Guilded. */
	completedAt?: string;
	/** The ID of the user who completed this list item on Guilded. */
	completedBy?: string;
	/** Represent the Base List Item Note on Guilded. */
	note?: ApiBaseListItemNote;
}

/**
 * Represents the List Item Note Value in Guilded.
 * @see https://www.guilded.gg/docs/api/listItems/ListItem
 */
export interface ApiListItemNote extends ApiBaseListItemNote {
	/** Represent the Mentions Associated of the List Item in Guilded. */
	mentions?: ApiBaseMentions;
	/** Represent the Content Associated the List Item in Guilded. */
	content: string;
}

/**
 * Represents the List Item Note in Guilded.
 * @see https://www.guilded.gg/docs/api/listItems/ListItemSummary
 */
export interface ApiListItem extends ApiListItemSummary {
	/** Represent the Base List Item Note on Guilded. */
	note?: ApiListItemNote;
}

/**
 * Represents the List Item Note Payload Value in Guilded.
 * @see https://www.guilded.gg/docs/api/listItems/ListItemCreate
 * @see https://www.guilded.gg/docs/api/listItems/ListItemUpdate
 * @see https://www.guilded.gg/docs/api/listItems/ListItemDelete
 */
export interface restListItemNotePayload {
	/** Represent the List Item Note Content Value on Guilded. */
	content: string;
}

/**
 * Represents the List Item Payload Value in Guilded.
 * @see https://www.guilded.gg/docs/api/listItems/ListItemCreate
 * @see https://www.guilded.gg/docs/api/listItems/ListItemUpdate
 * @see https://www.guilded.gg/docs/api/listItems/ListItemDelete
 */
export interface restListItemPayload {
	/** Represents The message of the list item */
	message: string;
	/** Represents The note of the list item */
	note?: restListItemNotePayload;
}
