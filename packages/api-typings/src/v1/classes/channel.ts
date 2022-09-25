import { ApiBase } from './bases'

/**
 * Represents Base Channel Class of Guilded.
 */
export interface ApiBaseChannel extends ApiBase {
  /* The Name of the Channel. */
  name: string
}

/**
 * Represents mentions with Channel on Guilded.
 * @see https://www.guilded.gg/docs/api/channels/Mentions
 */
export interface ApiChannelsMentions {
  /** The users that were mentioned. */
  users?: ApiBase[]
  /** The channels that were mentioned. */
  channels?: ApiBase[]
  /** The roles that were mentioned. */
  roles?: { id: number }[]
  /** Whether everyone was mentioned. */
  everyone?: boolean
  /** Whether here was mentioned. */
  here?: boolean
}

/**
 * Represents Server Channel on Guilded.
 * @see https://www.guilded.gg/docs/api/channels/ServerChannel
 */
export interface ApiServerChannel extends ApiBaseChannel {}
