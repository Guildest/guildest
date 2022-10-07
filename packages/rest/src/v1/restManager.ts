import { ApiBaseError } from '@guildest/guilded-api-typings';
import fetch from 'node-fetch';
import { version } from '../../package.json';
import { RestApiError } from './apiError';
import { router } from './utils/router';

/**
 * The REST-API Manager for the Guilded API.
 * @example new restManager({ version: 1, token: 'token' });
 */
export class restManager {
	/** REST API Authorization Token from Guilded Application. */
	token: string | undefined;
	/** Proxy Url for Guilded. */
	proxyUrl: string | undefined;
	/** Rest API version from Guilded. */
	version: number | undefined;
	/** Max Retries for 429 Ratelimit Error. */
	maxRetries: number;
	/** Router for Rest Manager consists of Model's Routers. */
	readonly router: router;

	/** @param options The options for the REST API manager. */
	constructor(public readonly options: restOptions) {
		this.token = options.token;
		this.proxyUrl = options.proxyUrl;
		this.maxRetries = options.maxRetries ?? 3;
		if (!this.proxyUrl) this.version = options.version;
		this.router = new router(this);
	}

	/** The Rest API Url for Interacting using node:fetch on Guilded. */
	get restUrl(): string {
		return this.proxyUrl ?? `https://www.guilded.gg/api/v${this.version}`;
	}

	/** The AuOth Headers using Guilded-App Token */
	get restAuthHeaders(): Record<string, any> {
		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${this.token}`,
			'User-Agent': `@guildest/rest@${version} Node.JS@${process.versions.node}`,
		};
	}

	/** The Non-AuOth Headers using Guilded-App Token */
	get restHeaders(): Record<string, any> {
		return {
			'Content-Type': 'application/json',
			'User-Agent': `@guildest/rest@${version} Node.JS@${process.versions.node}`,
		};
	}

	/**
	 * Make a request to the REST API.
	 * @param path The path to the resource.
	 * @param method The HTTP method.
	 * @param body The Body OR Json-Params for the request.
	 * @param query The Query-Params for the request.
	 * @param retries The number of retries.
	 * @returns The response from the REST API.
	 * @example rest.request('/channels/abc', 'GET');
	 */
	async request<R = any, B = any, Q extends Record<string, any> = Record<string, any>>(
		path: string,
		method: string,
		body?: B,
		query?: Q,
		retries = 0,
		authenticated = true,
	): Promise<R> {
		const sParams: URLSearchParams | undefined = Object.entries(query!)?.reduce(
			(tPara: URLSearchParams | undefined = new URLSearchParams(), eNt) => {
				tPara.append(...eNt);
				return tPara;
			},
			undefined,
		);
		const res = await fetch(this.restUrl + path + sParams, {
			method,
			headers: authenticated && this.token ? this.restAuthHeaders : this.restHeaders,
			body: body ? JSON.stringify(body) : undefined,
		});
		const rData = (await res.json()?.catch(() => ({
			message: 'JSON Parse failed of Response Object Data.',
		}))) as ApiBaseError | R;
		if (res.ok) return rData as R;
		else if (res.status === 429 && retries <= this.maxRetries) {
			const rInterval =
				(res?.headers?.get('Retry-After')
					? parseInt(res.headers.get('Retry-After')!)
					: undefined) ??
				this.options.retryInterval ??
				10 * 1000;
			await new Promise((resolve) => setTimeout(resolve, rInterval * 1000));
			return this.request(path, method, body, query, retries++, authenticated);
		}
		const error = rData as ApiBaseError;
		throw new RestApiError(
			error.code,
			error.message,
			res.status,
			method,
			path,
			this.restUrl + path + sParams,
			body,
			error.meta,
		);
	}

	/**
	 * Make a GET request to the REST API.
	 * @param path The path to the resource.
	 * @param body The Body OR Json-Params for the request.
	 * @param query The Query-Params for the request.
	 * @returns The response from the REST API.
	 * @example rest.get('/channels/abc');
	 */
	get<R = any, B = any, Q extends Record<string, any> = Record<string, any>>(
		path: string,
		body?: B,
		query?: Q,
		authenticated = true,
	): Promise<R> {
		return this.request<R, B, Q>(path, 'GET', body, query, 0, authenticated);
	}

	/**
	 * Make a POST request to the REST API.
	 * @param path The path to the resource.
	 * @param body The Body OR Json-Params for the request.
	 * @param query The Query-Params for the request.
	 * @returns The response from the REST API.
	 * @example rest.post('/channels/abc',{ name: 'Chat', type: 'chat' });
	 */
	post<R = any, B = any, Q extends Record<string, any> = Record<string, any>>(
		path: string,
		body?: B,
		query?: Q,
		authenticated = true,
	): Promise<R> {
		return this.request<R, B, Q>(path, 'POST', body, query, 0, authenticated);
	}

	/**
	 * Make a PATCH request to the REST API.
	 * @param path The path to the resource.
	 * @param body The Body OR Json-Params for the request.
	 * @param query The Query-Params for the request.
	 * @returns The response from the REST API.
	 * @example rest.patch('/channels/abc',{ name: 'Chat' });
	 */
	patch<R = any, B = any, Q extends Record<string, any> = Record<string, any>>(
		path: string,
		body?: B,
		query?: Q,
		authenticated = true,
	): Promise<R> {
		return this.request<R, B, Q>(path, 'PATCH', body, query, 0, authenticated);
	}

	/**
	 * Make a PUT request to the REST API.
	 * @param path The path to the resource.
	 * @param body The Body OR Json-Params for the request.
	 * @param query The Query-Params for the request.
	 * @returns The response from the REST API.
	 * @example rest.put('/channels/abc',{ content: 'Hello world!' });
	 */
	put<R = any, B = any, Q extends Record<string, any> = Record<string, any>>(
		path: string,
		body?: B,
		query?: Q,
		authenticated = true,
	): Promise<R> {
		return this.request<R, B, Q>(path, 'PUT', body, query, 0, authenticated);
	}

	/**
	 * Make a DELETE request to the REST API.
	 * @param path The path for the resource.
	 * @param body The Body OR Json-Params for the request.
	 * @param query The Query-Params for the request.
	 * @returns The response from the REST API.
	 * @example rest.delete('/channels/abc');
	 */
	delete<R = any, B = any, Q extends Record<string, any> = Record<string, any>>(
		path: string,
		body?: B,
		query?: Q,
		authenticated = true,
	) {
		return this.request<R>(path, 'DELETE', body, query, 0, authenticated);
	}
}

/** The options for the REST API manager. */
export interface restOptions {
	/** The auth token for the REST API. */
	token?: string;
	/** The version of the REST API. */
	version?: number;
	/** The proxy URL of the REST API. */
	proxyUrl?: string;
	/** The interval to wait between retries. */
	retryInterval?: number;
	/** The maximum number of retry attempts. */
	maxRetries?: number;
}
