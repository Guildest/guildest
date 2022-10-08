/**
 * Represents an error that occurred while interacting with the Guilded API.
 * @example new RestApiError('ErrorCode', 'Message', 404, 'GET', '/channels/abc);
 */
export class RestApiError extends Error {
	/**
	 * @param code The code of the error.
	 * @param message The message of the error.
	 * @param status The status code of the error.
	 * @param method The method used to make the request.
	 * @param path The path used to make the request.
	 * @param url The url used to make the request.
	 * @param body The body used to make the request.
	 * @param metadata The meta data of the error.
	 */
	constructor(
		public readonly code: string,
		public override readonly message: string,
		public readonly status: string | number,
		public readonly method: string,
		public readonly path: string,
		public readonly url: string,
		public readonly body?: any,
		public readonly metadata?: any,
	) {
		super(message);
		this.name = `RestApiError [${code}: ${status}]`;
	}
}
