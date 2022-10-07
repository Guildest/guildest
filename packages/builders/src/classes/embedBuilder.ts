export class EmbedBuilder {
	constructor(public readonly data?: Record<string, any>) {
		if (data) this.resolve(data);
	}

	public resolve(apiData: Record<string, any>) {
		return apiData;
	}
}
