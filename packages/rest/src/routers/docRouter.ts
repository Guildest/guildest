import { ApiDocs, restDocsPayload, Endpoints, restDocsQueryParams } from '@guildest/api-typings';
import { restManager } from '../restManager';

/**
 * The Docs Router for the Guilded REST Api.
 * @example new DocsRouter(rest)
 */
export class DocsRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	/**
	 * Create a New Doc on Channel on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param payload The JSON Parameters for Docs on Guilded.
	 * @returns New Doc Object on Guilded.
	 * @example DocsRouter.create("abc" , { content: "Doc Content Here!!" })
	 */

	async create(channelId: string, payload: restDocsPayload): Promise<ApiDocs> {
		return await this.rest
			.post<{ doc: ApiDocs }, restDocsPayload>(Endpoints.docs(channelId), payload)
			?.then((R) => R?.doc);
	}

	/**
	 * Fetch Doc on Channel on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param docId The ID of the Doc on Guilded.
	 * @param query The Query Parameters for Docs on Guilded.
	 * @returns Doc Object on Guilded.
	 * @example DocsRouter.fetch("abc" , "xyz")
	 */

	async fetch(channelId: string, docId: string): Promise<ApiDocs> {
		return await this.rest
			.get<{ doc: ApiDocs }>(Endpoints.doc(channelId, parseInt(docId)))
			.then((R) => R?.doc);
	}

	/**
	 * Fetch Docs on Channel on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param query The Query Parameters for Docs on Guilded.
	 * @returns Doc Objects on Guilded.
	 * @example DocsRouter.fetchAll("abc")
	 */

	async fetchAll(channelId: string, query?: restDocsQueryParams): Promise<Array<ApiDocs>> {
		return await this.rest
			.get<{ docs: Array<ApiDocs> }, undefined, restDocsQueryParams>(
				Endpoints.docs(channelId),
				undefined,
				query,
			)
			.then((R) => R?.docs);
	}

	/**
	 * Update Doc on Channel on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param docId The ID of the Doc on Guilded.
	 * @param payload The JSON Parameters for Docs on Guilded.
	 * @returns Updated Doc Object on Guilded.
	 * @example DocsRouter.update("abc" , "xyz")
	 */

	async update(channelId: string, docId: string, payload: restDocsPayload): Promise<ApiDocs> {
		return await this.rest
			.put<{ doc: ApiDocs }, restDocsPayload>(
				Endpoints.doc(channelId, parseInt(docId)),
				payload,
			)
			?.then((R) => R?.doc);
	}

	/**
	 * Delete Doc on Channel on Guilded.
	 * @param channelId The ID of the channel on Guilded.
	 * @param docId The ID of the Doc on Guilded.
	 * @returns Boolean Value as "true" or Error
	 * @example DocsRouter.delete("abc" , "xyz")
	 */

	async delete(channelId: string, docId: string): Promise<boolean> {
		return await this.rest
			.delete<void>(Endpoints.doc(channelId, parseInt(docId)))
			?.then(() => true);
	}
}
