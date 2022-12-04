import type { ApiBaseMentions } from './base';

/**
 * Payload Value of Api Docs during Creation and Modification
 * @see https://www.guilded.gg/docs/api/docs/DocCreate
 */
export interface restDocsPayload {
	/** Title Value of the Docs */
	title: string;
	/** Content Value of the Docs */
	content: string;
}

/**
 * Docs Value Object on Guilded.
 * @see https://www.guilded.gg/docs/api/docs/Doc
 */
export interface ApiDocs extends restDocsPayload {
	/** Unique Id of the Docs on Guilded. */
	id: string;
	/** Represents the Associated Server Id of the Docs on Guilded. */
	serverId: string;
	/** Represents the Associated Channel Id of the Docs on Guilded. */
	channelId: string;
	/** Mentions Related to Docs. */
	mentions?: ApiBaseMentions;
	/** Creation of the Docs with ISO-String Value of Time/Date. */
	createdAt: string;
	/** The ID of the user who created this doc */
	createdBy: string;
	/** The ISO 8601 timestamp that the doc was updated at, if relevant */
	updatedAt: string;
	/** The ID of the user who updated this doc */
	updatedBy: string;
}

/**
 * Payload Value of Api Docs during Creation and Modification
 * @see https://www.guilded.gg/docs/api/docs/DocReadMany
 */
export interface restDocsQueryParams {
	/** An ISO 8601 timestamp that will be used to filter out results for the current page on Guilded. */
	before?: string;
	/** The max size of the page (default 25; min 1; max 100) on Guilded. */
	limit?: number;
}
