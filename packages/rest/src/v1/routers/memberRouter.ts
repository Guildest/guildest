import {
	ApiServerMember,
	ApiServerMemberSummary,
	ApiServerMemberUpdatePayload,
	Endpoints,
} from '@guildest/guilded-api-typings';
import { restManager } from '../restManager';

/**
 * The Server Member Router for the Guilded REST Api.
 * @example new MemberRouter(rest)
 */
export class MemberRouter {
	/** @param rest The REST API manager the router belongs to. */
	constructor(public readonly rest: restManager) {}

	async update<R = ApiServerMemberUpdatePayload>(
		serverId: string,
		memberId: string,
		body: R,
	): Promise<R> {
		return await this.rest.put<R>(
			Endpoints.serverNickname(serverId, memberId),
			undefined,
			body,
		);
	}

	async delete<R = void>(serverId: string, memberId: string): Promise<boolean> {
		return await this.rest
			.delete<R>(Endpoints.serverNickname(serverId, memberId))
			.then(() => true);
	}

	async fetch<R = ApiServerMember, Rs = ApiServerMemberSummary>(
		serverId: string,
		memberId: string,
	): Promise<R | Array<Rs>> {
		if (memberId)
			return await this.rest
				.get<{ member: R }>(Endpoints.serverMember(serverId, memberId))
				.then((R) => R?.member);
		else
			return await this.rest
				.get<{ members: Array<Rs> }>(Endpoints.serverMembers(serverId))
				.then((R) => R?.members);
	}

	async kick<R = void>(serverId: string, memberId: string): Promise<boolean> {
		return this.rest.delete<R>(Endpoints.serverMember(serverId, memberId)).then(() => true);
	}
}
