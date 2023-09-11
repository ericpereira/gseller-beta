import { ErrorResult } from '@vendure/core';

export class ChannelNotFoundError extends ErrorResult {
  readonly __typename = 'ChannelNotFoundError';
  readonly errorCode = 'CHANNEL_NOT_FOUND';
  readonly message = 'Channel not found.';
}

