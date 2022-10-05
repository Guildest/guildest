import {
	ApiDocs,
	ApiDocsPayload,
	Endpoints,
	ApiDocsQueryParams,
} from '@guildest/guilded-api-typings';
import { restManager } from '../restManager';

/**
 * The Docs Router for the Guilded REST Api.
 * @example new DocsRouter(rest)
 */
export class DocsRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	async create(channelId: string, payload: ApiDocsPayload): Promise<ApiDocs> {
		return await this.rest
			.post<{ doc: ApiDocs }, ApiDocsPayload>(Endpoints.docs(channelId), payload)
			?.then((R) => R?.doc);
	}

	async fetch(
		channelId: string,
		docId?: string,
		query?: ApiDocsQueryParams,
	): Promise<ApiDocs | Array<ApiDocs>> {
		if (docId)
			return await this.rest
				.get<{ doc: ApiDocs }>(Endpoints.doc(channelId, parseInt(docId)))
				.then((R) => R?.doc);
		else
			return await this.rest
				.get<{ docs: Array<ApiDocs> }, undefined, ApiDocsQueryParams>(
					Endpoints.docs(channelId),
					undefined,
					query,
				)
				.then((R) => R?.docs);
	}

	async update(channelId: string, docId: string, payload: ApiDocsPayload): Promise<ApiDocs> {
		return await this.rest
			.put<{ doc: ApiDocs }, ApiDocsPayload>(
				Endpoints.doc(channelId, parseInt(docId)),
				payload,
			)
			?.then((R) => R?.doc);
	}

	async delete(channelID: string, docId: string): Promise<boolean> {
		return await this.rest
			.delete<void>(Endpoints.doc(channelID, parseInt(docId)))
			?.then(() => true);
	}
}
