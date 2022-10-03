import { ApiBaseError } from '@guildest/guilded-api-typings';
import { version } from '../../package.json';
import { RestApiError } from './apiError';

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

	/** @param options The options for the REST API manager. */
	constructor(public readonly options: restOptions) {
		this.token = options.token;
		this.proxyUrl = options.proxyUrl;
		this.maxRetries = options.maxRetries ?? 3;
		if (!this.proxyUrl) this.version = options.version;
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
	 * @param query The Query/Params for the request.
	 * @param body The Body/Json-Data for the request.
	 * @param retries The number of retries.
	 * @returns The response from the REST API.
	 * @example rest.request('/channels/abc', 'GET');
	 */
	async request<R = any, B = any, Q extends Record<string, any> = Record<string, any>>(
		path: string,
		method: string,
		query: Q,
		body: B,
		retries: number = 0,
		authenticated: boolean = true,
	): Promise<R> {
		const sParams: URLSearchParams | undefined = Object.entries(query)?.reduce(
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
		const rData = (await res.json()?.catch(() => undefined)) as ApiBaseError | R;
		if (res.ok) return rData as R;
		else if (res.status === 429 && retries <= this.maxRetries) {
			const rInterval =
				parseInt(res?.headers?.get('Retry-After')!) ??
				this.options.retryInterval ??
				10 * 1000;
			await new Promise((resolve) => setTimeout(resolve, rInterval * 1000));
			return this.request(path, method, query, body, retries++, authenticated);
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
	 * @param query The Query/Params for the request.
	 * @param body The Body/Json-Data for the request.
	 * @returns The response from the REST API.
	 * @example rest.get('/channels/abc');
	 */
	get<B extends any, Q extends Record<string, any> = Record<string, any>>(
		path: string,
		query: Q,
		body: B,
		authenticated: boolean = true,
	) {
		return this.request(path, 'GET', query, body, 0, authenticated);
	}

	/**
	 * Make a POST request to the REST API.
	 * @param path The path to the resource.
	 * @param query The Query/Params for the request.
	 * @param body The Body/Json-Data for the request.
	 * @returns The response from the REST API.
	 * @example rest.post('/channels/abc',undefined,{ name: 'Chat', type: 'chat' });
	 */
	post<B extends any, Q extends Record<string, any> = Record<string, any>>(
		path: string,
		query: Q,
		body: B,
		authenticated: boolean = true,
	) {
		return this.request(path, 'POST', query, body, 0, authenticated);
	}

	/**
	 * Make a PATCH request to the REST API.
	 * @param path The path to the resource.
	 * @param query The Query/Params for the request.
	 * @param body The Body/Json-Data for the request.
	 * @returns The response from the REST API.
	 * @example rest.patch('/channels/abc',undefined,{ name: 'Chat' });
	 */
	patch<B extends any, Q extends Record<string, any> = Record<string, any>>(
		path: string,
		query: Q,
		body: B,
		authenticated: boolean = true,
	) {
		return this.request(path, 'PATCH', query, body, 0, authenticated);
	}

	/**
	 * Make a PUT request to the REST API.
	 * @param path The path to the resource.
	 * @param query The Query/Params for the request.
	 * @param body The Body/Json-Data for the request.
	 * @returns The response from the REST API.
	 * @example rest.put('/channels/abc',undefined,{ content: 'Hello world!' });
	 */
	put<B extends any, Q extends Record<string, any> = Record<string, any>>(
		path: string,
		query: Q,
		body: B,
		authenticated: boolean = true,
	) {
		return this.request(path, 'PUT', query, body, 0, authenticated);
	}

	/**
	 * Make a DELETE request to the REST API.
	 * @param path The path for the resource.
	 * @returns The response from the REST API.
	 * @example rest.delete('/channels/abc');
	 */
	delete<Q extends Record<string, any> = Record<string, any>>(
		path: string,
		query: Q,
		authenticated: boolean = true,
	) {
		return this.request(path, 'DELETE', query, undefined, 0, authenticated);
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
